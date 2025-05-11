import { User, Relation } from '../models/schema.js';
import { getGroqChatCompletion } from '../ai.js';
import { socketAuthMiddleware } from '../jwt.js'
import { Chat } from '../models/schema.js';
import { decodeString } from '../utils/helper.js';

export let users = {};   //for storing users soket id 

function handleMessage(io) {
    //Storing the data in the memory

    //Middleware
    io.use(socketAuthMiddleware);
    io.on('connection', (socket) => {
        //user connected
        socket.on('register', async () => {
            try {
                users[socket.chatUser.relationId] = { socketId: socket.id, status: "online" }
                const { groups } = await Relation.findById(decodeString(socket.chatUser.relationId)).select("-_id groups")
                for (let i = 0; i < groups.length; i++) {
                    socket.join(groups[i])
                }
            } catch (error) {
                console.log("error while joining group")
            }
        });

        //user disconnected
        socket.on('disconnect', () => {
            users[socket.chatUser.relationId].status = "offline";
        });

        socket.on('create-group', ({ groupId, relationIds }) => {
            for (let i = 0; i < relationIds.length; i++) {
                if (relationIds[i] in users && users[relationIds[i]].status) { // if the friend is present in the 
                    const friendSocket = io.sockets.sockets.get(users[relationIds[i]].socketId);  // geting the socket from socketId
                    if (friendSocket) {
                        friendSocket.join(groupId);
                    }
                }
            }
        });


        //msg to ai
        socket.on('ai', async (msg) => {
            try {
                let chatCompletion = await getGroqChatCompletion(msg)
                let aiResponse = (chatCompletion.choices[0]?.message?.content || "")
                const formattedResponse = aiResponse
                    // .replace(/\n/g, '<br>')
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
                socket.emit('ai-response', formattedResponse)
            } catch (error) {
                socket.emit('ai-response', "Please Check you network connection!")
            }
        });

        // Private message
        socket.on('send-private-message', async ({ senChatId, recChatId, relationId, msg }) => {

            // console.log("senChatId , recChatId : ", senChatId, recChatId);
            // console.log("relationId , msg", relationId, msg);

            //Emit message only when user is online and present in the users
            if (relationId in users && users[relationId].status == "online") {
                socket.to(users[relationId].socketId).emit('receive-private-message', { chatId: senChatId, msg });
            }

            const storeMsg = { chatId: senChatId, msg, timestamp: Date.now() }
            await Chat.findByIdAndUpdate(
                senChatId,
                { $push: { messages: { $each: [storeMsg], $position: 0 } } }
            );
            await Chat.findByIdAndUpdate(
                recChatId,
                { $push: { messages: { $each: [storeMsg], $position: 0 } } }
            );
        }); ``

        // Goup message
        socket.on('send-group-message', async ({ groupId, senChatId, recChatId, msg }) => {
            console.log("inside group msg...")
            socket.to(groupId).emit('receive-group-message', { groupId, username: socket.chatUser.username, chatId: senChatId, msg, })  // emmiting the message in the whole group

            recChatId.unshift(senChatId);
            for (let i = 0; i < recChatId.length; i++) {
                const storeMsg = { chatId: recChatId[i], username: socket.chatUser.username, msg, timestamp: Date.now() }
                await Chat.findByIdAndUpdate(
                    recChatId,
                    { $push: { messages: { $each: [storeMsg], $position: 0 } } }
                )
            }
        });

    });
};

export default handleMessage;