import { jwtAuthMiddleware, generateToken } from '../jwt.js';
import { User, Relation, Chat } from '../models/schema.js';
import { emailExist, encodeString, decodeString, getTotalMsgs } from '../utils/helper.js';
import { users } from './msg.js';
import { v4 } from 'uuid';
import mongoose from 'mongoose';
import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';

const router = express.Router();
dotenv.config();

//Handling The User Validataions

router.get('/is-logged-in', jwtAuthMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.chatUser.id).select("-_id -password -createAt")
        res.status(200).json({ auth: true, relationId: user.relationId, username: user.username, profilePicture: user.profilePicture, email: user.email, phoneNumber: user.phoneNumber })

    } catch (error) {
        console.error("Error in isLogged in : ", error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

router.post('/sign-in', async (req, res) => {
    // console.log("Signin : ", req)
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }) // Return null if it did't exist
        //If user==null and password didn't match
        if (!user || user.password !== password) {
            return res.status(401).json({ auth: false, error: "Incorrect Credentials" })
        }

        const payload = {
            id: user.id,
            username: user.username,
            relationId: user.relationId
        }
        const token = generateToken(payload)
        // return token
        res.status(201)
            .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV == "production" })
            .json({ auth: true, username: user.username, profilePicture: user.profilePicture, email: user.email, phoneNumber: user.phoneNumber })

    } catch (error) {
        console.error("Error in signin...  \n", error);
        res.status(500).json({ auth: false, error: "Internal Server Error" });
    }
});

router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        // const user = await User.create({ username, password, email });  // alternative method 

        const relation = await Relation.create({ username });
        const relationId = encodeString(relation.id)

        const user = new User({ relationId, username, profilePicture: null, email, password, phoneNumber, createAt: Date.now() });
        await user.save();

        const payload = {
            // id:user._id.toString(), because it will give something like "ObjectId('678e47c67b1cb34dd536a4d7')" value. 
            // user.id it will give plane "678e47c67b1cb34dd536a4d7" value
            id: user.id,
            username: user.username,
            relationId
        }
        const token = generateToken(payload)
        console.log("the user is : ", user)
        res.status(200).cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV == "production" })
            .json({ auth: true, username: user.username, profilePicture: user.profilePicture, email: user.email, phoneNumber: user.phoneNumber })
    } catch (error) {
        console.error("Error in signup...  \n", error);
        res.status(500).json({ auth: false, error: "Internal Server Error" });
    }
});

router.get('/sign-out', jwtAuthMiddleware, (req, res) => {
    res.clearCookie("token").end();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const cleanFileName = file.originalname.replace(/\s+/g, ""); // Removes all spaces
        cb(null, `${Date.now()}-${cleanFileName}`);
    }
});

const upload = multer({ storage: storage })
router.post('/set-profilePicture', jwtAuthMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        const profilePicture = req.file;
        const { oldProfilePicture } = req.body;

        //Deleting the old picture from the uploads
        if (oldProfilePicture) {
            if (fs.existsSync(`./uploads/${oldProfilePicture}`)) { //Because it can be "null" and it is a valid string
                fs.unlinkSync(`./uploads/${oldProfilePicture}`);
            }
        }

        const sender = { id: req.chatUser.id, relationId: decodeString(req.chatUser.relationId) }

        await User.findByIdAndUpdate(
            sender.id,
            { $set: { profilePicture: profilePicture.filename } }
        );

        // Changing the profilePicture in the Requests section of my pendings friends
        const { pendings } = await Relation.findById(sender.relationId).select("pendings.relationId");  // pendings.relationId it is faster rather than the whole pending
        for (let i = 0; i < pendings.length; i++) {
            await Relation.updateOne(
                { _id: decodeString(pendings[i].relationId), "requests.relationId": req.chatUser.relationId },
                { $set: { "requests.$.profilePicture": profilePicture.filename } }
            )
        }

        const { requests } = await Relation.findById(sender.relationId).select("requests.relationId");
        for (let i = 0; i < requests.length; i++) {
            await Relation.updateOne(
                { _id: decodeString(requests[i].relationId), "pendings.relationId": req.chatUser.relationId },
                { $set: { "pendings.$.profilePicture": profilePicture.filename } }
            );
        }

        const { friends } = await Relation.findById(sender.relationId).select("friends.relationId");
        for (let i = 0; i < friends.length; i++) {
            await Relation.updateOne(
                { _id: decodeString(friends[i].relationId), "friends.relationId": req.chatUser.relationId },
                { $set: { "friends.$.profilePicture": profilePicture.filename } }
            );
        }

        res.status(200).json({ message: 'Image save successfylly' });
    } catch (error) {
        console.error("Error in set profilePicture : ", error);
        res.status(500).json({ error: "Wrong Image OR Internal Server Error" });
    }
});

router.get('/get-profilePicture', jwtAuthMiddleware, async (req, res) => {
    try {
        const { profilePicture } = await User.findById(req.chatUser.id).select('profilePicture');
        res.status(200).json(profilePicture);
    } catch (error) {
        console.error("Error in get profilePicture...  \n", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//Handling Search
router.get('/search', jwtAuthMiddleware, async (req, res) => {
    // console.log("Search : ", req)
    const { name = '', page = 1, limit = 10 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    try {
        let users = await User.find({ username: new RegExp(name, 'i') })
            .sort({ username: 1 }) //1 meaning ascending order
            .skip(skip)
            .limit(parseInt(limit))
            .select('-_id relationId username profilePicture');

        const sender = { relationId: decodeString(req.chatUser.relationId) }
        const { pendings } = await Relation.findById(sender.relationId).select("pendings.relationId");
        const { requests } = await Relation.findByIdAndUpdate(sender.relationId).select("requests.relationId");
        let { friends } = await Relation.findById(sender.relationId).select("friends.relationId");

        friends.push(...pendings, ...requests);
        for (let i = users.length - 1; i >= 0; i--) {
            for (let j = 0; j < friends.length; j++) {
                if (users[i].relationId == friends[j].relationId) {
                    // users.splice(i, 1);
                    users[i].isFriend = true;
                    break; // Exit the inner loop since we've modified the users array
                }
            }
        }
        console.log("Final Users : ", users);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in search...  \n", error);
        res.status(500).json({ error: "Username Not Found OR Internal Server Error" });
    }
});

// when some one send a friend request
router.post('/send-request', jwtAuthMiddleware, async (req, res) => {
    try {
        const receiver = req.body
        const sender = await User.findById(req.chatUser.id).select("relationId username profilePicture");
        if (sender.relationId == receiver.relationId) return res.end();

        const sen = { relationId: sender.relationId, username: sender.username, profilePicture: sender.profilePicture }
        const rec = { relationId: receiver.relationId, username: receiver.username, profilePicture: receiver.profilePicture }
        //Adding the request to the pending
        await Relation.findByIdAndUpdate(
            decodeString(sender.relationId),
            { $addToSet: { pendings: rec } }
        )

        // finding the user and update its requests list , new:true will return the new requests
        await Relation.findByIdAndUpdate(
            decodeString(receiver.relationId),
            { $addToSet: { requests: sen } } //$addToSet will append the id only if there is no duplicate present in the requests ,$push will append the id 
        );
        res.end();

    } catch (error) {
        console.error("Error in sending request...  \n", error);
        res.status(500).json({ error: "Wrong recever_id OR Internal Server Error" });
    }
});

router.get('/get-pendings', jwtAuthMiddleware, async (req, res) => {
    try {
        const page = req.query.page
        const limit = 10
        const { pendings } = await Relation.findById(decodeString(req.chatUser.relationId)).select('pendings')
        const paginatedPendings = pendings.slice((page - 1) * limit, (page * limit))
        res.status(200).json(paginatedPendings)
    } catch (error) {
        console.error("Error in pending...  \n", error);
        res.status(500).json({ error: "Pending Not Found OR Internal Server Error" });
    }
});
//Handling Friends AND Requests

router.post('/remove-pending', jwtAuthMiddleware, async (req, res) => {
    try {
        const receiver = req.body
        const sender = { relationId: req.chatUser.relationId }
        await Relation.findByIdAndUpdate(
            decodeString(sender.relationId),
            { $pull: { pendings: { relationId: receiver.relationId } } }
        );
        await Relation.findByIdAndUpdate(
            decodeString(receiver.relationId),
            { $pull: { requests: { relationId: sender.relationId } } }
        );
        res.end();

    } catch (error) {
        console.error("Error in remove pending...  \n", error);
        res.status(500).json({ error: "remove Pending Not Found OR Internal Server Error" });
    }
});

router.get('/get-requests', jwtAuthMiddleware, async (req, res) => {
    try {
        const page = req.query.page
        const limit = 10
        const { requests } = await Relation.findById(decodeString(req.chatUser.relationId)).select('requests')
        const paginatedRequests = requests.slice((page - 1) * limit, page * limit)
        res.status(200).json(paginatedRequests)
    } catch (error) {
        console.error("Error in fetching request...  \n", error);
        res.status(500).json({ error: "Request Error OR Internal Server Error" });
    }
});

router.post('/accept-request', jwtAuthMiddleware, async (req, res) => {
    try {
        const sender = await User.findById(req.chatUser.id).select("-_id relationId username profilePicture")
        const receiver = req.body

        let sen = { relationId: sender.relationId, username: sender.username, profilePicture: sender.profilePicture, senChatId: null, recChatId: null, isGroup: false };
        let rec = { relationId: receiver.relationId, username: receiver.username, profilePicture: receiver.profilePicture, senChatId: null, recChatId: null, isGroup: false };

        // since encoded relationId no longer needed 
        sender.relationId = decodeString(sender.relationId);
        receiver.relationId = decodeString(receiver.relationId);

        // Removing the accept request and pending request for the sender and the receiver
        await Relation.findByIdAndUpdate(
            sender.relationId,
            { $pull: { requests: { relationId: rec.relationId } } }, // Remove accept for sender
        );
        await Relation.findByIdAndUpdate(
            receiver.relationId,
            { $pull: { pendings: { relationId: sen.relationId } } }  // Remove pending for receiver
        );

        // initializing chat for sender and receiver
        let senChat;
        const recChat = await Chat.create({});

        // here we are checking if the sender has already has that friend previously or not if yes then we only need to create the reqChatId
        const exists = await Relation.findOne({ _id: sender.relationId, "friends.relationId": rec.relationId })
        if (exists) {
            senChat = { id: exists.friends[0].senChatId };
        } else {
            senChat = await Chat.create({});
        }
        //store inside receiver array
        sen.senChatId = recChat.id;
        sen.recChatId = senChat.id;

        //store inside sender array
        rec.senChatId = senChat.id;
        rec.recChatId = recChat.id;

        await Relation.findByIdAndUpdate(
            sender.relationId,
            { $push: { friends: { $each: [rec], $position: 0 } } } //$each expect an array so that's why we use []
        );

        await Relation.findByIdAndUpdate(
            receiver.relationId,
            { $push: { friends: { $each: [sen], $position: 0 } } } //$each expect an array so that's why we use []
        );

        res.end();

    } catch (error) {
        console.error("Error in accept request...  \n", error);
        res.status(500).json({ error: "Wrong friend request OR Internal Server Error" });
    }
});

router.post('/remove-request', jwtAuthMiddleware, async (req, res) => {
    try {
        const sender = { relationId: req.chatUser.relationId }
        const receiver = req.body;

        // Removing the accept request and pending request for the sender and the receiver
        await Relation.findByIdAndUpdate(
            decodeString(sender.relationId),
            { $pull: { requests: { relationId: receiver.relationId } } }, // Remove accept for sender
        );

        await Relation.findByIdAndUpdate(
            decodeString(receiver.relationId),
            { $pull: { pendings: { relationId: sender.relationId } } }  // Remove pending for receiver
        );

        res.end();
    } catch (error) {
        console.error("Error in remove request...  \n", error);
        res.status(500).json({ error: "Wrong friend request OR Internal Server Error" });
    }
});

router.get('/get-friends', jwtAuthMiddleware, async (req, res) => {
    try {
        const page = req.query.page
        const limit = req.query.limit
        const { friends } = await Relation.findById(decodeString(req.chatUser.relationId)).select('friends')
        const paginatedFriends = friends.slice((page - 1) * limit, page * limit)

        // for (let i = 0; i < paginatedFriends.length; i++) {
        //     if (!users[paginatedFriends[i].id]) {
        //         paginatedFriends[i].status = "offline"
        //         continue
        //     }
        //     if (users[paginatedFriends[i].id].status == "online") {
        //         paginatedFriends[i].status = "online"
        //     }
        //     else {
        //         paginatedFriends[i].status = "offline"
        //     }
        // }

        // console.log("Friends : ", paginatedFriends)

        res.status(200).send(paginatedFriends)
    } catch (error) {
        console.error("Error in Friends...  \n", error);
        res.status(500).json({ error: "Wrong friend request OR Internal Server Error" });
    }
});

router.post('/remove-friend', jwtAuthMiddleware, async (req, res) => {
    try {
        const sender = { relationId: decodeString(req.chatUser.relationId) }
        const receiver = req.body;
        // receiver.senChatId : this is my chat id not the receiver

        // I am only deleting from the sender side because i want receiver should have those msg until he remove by himself

        // deleting the current friend from account
        await Relation.findByIdAndUpdate(
            sender.relationId,
            { $pull: { friends: { relationId: receiver.relationId } } }
        );

        await Chat.findByIdAndDelete(receiver.senChatId);  // removing senderChatId

        //set null to the receiver recChatId because , i deleted it in the upper line
        await Relation.updateOne(
            { _id: decodeString(receiver.relationId), "friends.recChatId": receiver.senChatId },
            { $set: { "friends.$.recChatId": null } }
        )

        res.end();
    } catch (error) {
        console.error("Error in removeFriends...  \n", error);
        res.status(500).json({ error: "Wrong friend request OR Internal Server Error" });
    }
});

// router.post('/search-friends', jwtAuthMiddleware, async (req, res) => {
//     try {
//         const { username = "", page = 1, limit = 10 } = req.query;
//         // const friends = sender.findOne()
//         res.end();
//     } catch (error) {
//         console.error("Error in Get Friends", error);
//         res.status(500).end();
//     }
// });

router.post('/create-group', jwtAuthMiddleware, upload.single('groupPicture'), async (req, res) => {
    try {
        // console.log("working create group ..", req);
        const groupPicture = req.file;
        const groupName = req.body.groupName;
        let friends = JSON.parse(req.body.friends);
        const groupId = v4();
        const sender = await User.findById(req.chatUser.id).select("-_id relationId username profilePicture")
        // Initializing
        friends = [{ relationId: sender.relationId, username: sender.username, profilePicture: sender.profilePicture }, ...friends]
        let relationId = [], participants = [], recChatId = [];

        for (let i = 0; i < friends.length; i++) {
            relationId.push(friends[i].relationId);
            const chatId = await Chat({});
            recChatId.push(chatId.id);
            participants.push({
                relationId: friends[i].relationId,
                chatId: chatId.id,
                username: friends[i].username,
                profilePicture: friends[i].profilePicture,
                role: i === 0 ? "owner" : "user"
            });
        }

        // console.log("groupId is : ", groupId);
        // console.log("relationId is : ", relationId);
        // console.log("groupName is : ", groupName);
        // console.log("participants is : ", participants);
        console.log("Debugging...")
        console.log("recChatId is : ", recChatId);

        // updating
        for (let i = 0; i < friends.length; i++) {
            const rel = relationId.filter((_, index) => index != i);  // removing the current relationId
            // const par = participants.filter((_, index) => index != i);
            const rec = recChatId.filter((_, index) => index != i);   // removing the current chatId , because it is present in senChatId
            const group = { groupId, relationId: rel, groupName, groupPicture: groupPicture.filename, participants, senChatId: recChatId[i], recChatId: rec, isGroup: true };

            await Relation.updateOne(
                { _id: decodeString(relationId[i]) },
                {
                    $push: {
                        friends: { $each: [group], $postion: 0 },
                        groups: groupId
                    }
                }
            )
        }
        res.status(201).json(groupId);
    } catch (error) {
        console.error("Error in create group", error);
        res.status(500).end();
    }
});

router.post('/delete-member', jwtAuthMiddleware, async (req, res) => {
    try {
        const { groupId, friendRelationId, participants, friendChatId } = req.body;
        console.log("groupId is :", groupId)
        console.log("Owner relationId is : ", req.chatUser.relationId)
        console.log("friendRelationId is :", friendRelationId)
        console.log("participants is :", participants)
        console.log("FriendChatId is :", friendChatId)
        if (friendRelationId == req.chatUser.relationId) res.status(405).end()   // owner can't remove himself

        await Relation.findByIdAndUpdate(                 // Deleting the group info in friends from ( friendRelationId )
            decodeString(friendRelationId),
            { $pull: { friends: { groupId } } }
        )

        await Chat.findByIdAndDelete(friendChatId)        // Deleting the FriendChatId

        // Deleting friend in every participants friends list
        // Deleting the chatId from every participants recChatIds
        for (let i = 0; i < participants.length; i++) {
            console.log("The value of participants is : ", participants[i].relationId);
            if (participants[i].relationId == friendRelationId) continue
            await Relation.findOneAndUpdate(
                { _id: decodeString(participants[i].relationId), "friends.groupId": groupId },
                {
                    $pull: {
                        "friends.$.relationId": friendRelationId,
                        "friends.$.participants": { relationId: friendRelationId },
                        "friends.$.recChatId": friendChatId
                    }
                }
            )
        }

        res.end();
    } catch (error) {
        console.error("Error in delete-member : ", error)
        res.status(500).end();
    }
})

router.post('/get-messages', jwtAuthMiddleware, async (req, res) => {
    try {
        const { page = 1, chatId } = req.body
        let { limit = 5, totalMsgs } = req.body;
        if (page == 1) totalMsgs = await getTotalMsgs(chatId); //set totalMsgs , if the page is 1
        console.log("page and chat id value : ", page, chatId)

        const newTotalMsgs = await getTotalMsgs(chatId);
        const difference = (newTotalMsgs - totalMsgs) || 0;
        const start = ((page - 1) * limit) + difference;
        const chat = await Chat.findById(chatId, { messages: { $slice: [start, 10] } });  // skip,limit
        const messages = chat ? chat.messages : []

        res.status(200).json({ messages, totalMsgs });
    } catch (error) {
        console.error("Error in getMessages : ", error)
        res.status(500).end();
    }
});

export default router
//Using default because there is only one function and i can create any name does't have to be the router