import { v4 } from "uuid"
import { Chat } from "../models/schema.js";

async function emailExist(email) {
    //     const user = await User.findOne({ email })
    //     if (user) {
    //         return true
    //     } else {
    //         return false
    //     }
}

function encodeString(id) {
    const time = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const uuid = v4()
    const arr = uuid.split("-")
    const str = id.slice(0, 8) + "-" + time + "-" + id.slice(id.length - 4, id.length) + "-" + arr[3] + "-" + id.slice(8, id.length - 4)
    // 678e4813-3327-6a2b-89cf-e1e4661d4faf
    // real id : 678e4813 e1e4661d4faf 6a2b

    return str
}

function decodeString(referenceId) {
    const array = referenceId.split("-")
    const str = array[0] + array[4] + array[2]
    return str
}

async function getTotalMsgs(chatId) {
    const result = await Chat.aggregate([
        { $match: { "messages.chatId": chatId } }, // Match documents with the chatId in messages
        {
            $project: {
                messagesCount: { $size: "$messages" } // Count the messages array
            }
        }
    ]);

    if (result.length === 0) {
        return 0;
    }

    const temp = result[0].messagesCount;
    const msg = temp ? temp : 0
    return msg;

}

export {
    emailExist,
    encodeString,
    decodeString,
    getTotalMsgs
}