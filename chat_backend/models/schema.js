import mongoose from 'mongoose';
// Define SignUpForm schema
const userSchema = new mongoose.Schema({
    relationId: { type: String, required: true },  // relationSchema encoded _id
    username: { type: String, required: true },    // user name
    profilePicture: { type: String },              // photo
    email: { type: String, required: true },       // email
    password: { type: String, required: true },    // password
    phoneNumber: { type: String, required: true }, // phone number
    createAt: { type: String, required: true }     // created time
}); // we can also do this , { collection: 'users' }

const relationSchema = new mongoose.Schema({
    username: { type: String, required: true }, // temporary for debug
    pendings: [], // { username, relationId, profilePicture }
    requests: [], // { username, relationId, profilePicture }
    friends: [],
    // for friends :  
    // { username, relationId, profilePicture, senChatId, recChatId, isGroup } , senChatId : who is storing the msg (me)

    // for groups : 
    // participants : {groupId, relationId[], groupName, groupPicture, participants[ relationId,username,profilePicture,type ], senChatId, recChatId[], isGroup }
    // senChatId : who is storing the msg (me) , recChatId : where all the msg will be stored
    groups: []  // { relationId : [groupId] } , for storing the socketId of all the groups currently available
});

const chatSchema = new mongoose.Schema({
    messages: []
    // for friends :
    // { chatId, msg, timestamp }

    // for groups :
    // { username, chatId, msg, timestamp }
});

// Create and export the models
export const User = mongoose.model('users', userSchema);
export const Relation = mongoose.model('relations', relationSchema);
export const Chat = mongoose.model('chats', chatSchema);