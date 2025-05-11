import { useContext, useState } from "react"
import { IoExit } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { MdDeleteForever, MdDelete } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";


import { deleteMember, exitGroup } from "../../services/api";

import { user } from "../../context/profile"


const GroupInfo = ({ setConfirm, friend }) => {
    const info = useContext(user);
    const [add, confirmAdd] = useState(false);

    const handleDelete = async ({ groupId, username, friendRelationId, participants, friendChatId }) => {
        console.log("inside handleDelete..")
        if (info.profile.relationId == participants[0].relationId) { // if sender is the owner , then only member can be deleted
            console.log("removing friend friend from group...")
            const status = await deleteMember({ groupId, username, friendRelationId, participants, friendChatId, })
            if (status) console.log(username, "removed from group")
        }
    }

    const handleClose = () => {
        setConfirm(false)
    }

    const handleExit = async ({ groupId }) => {
        // const status = await exitGroup({groupId});
        // if(status) console.log("Successfully exit from the group")
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen bg-zinc-900 bg-opacity-60 hover:cursor-default'>
            <div className="absolute top-1/2 left-1/2 w-[30%] h-[80%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-full h-[30%] p-5 flex justify-center items-center bg-neutral-900 rounded-t-lg">
                    <RxCross1 className="absolute top-0 right-0 hover:cursor-pointer size-5" onClick={handleClose} />
                    <img
                        src={`http://localhost:3000/uploads/${encodeURIComponent(friend.groupPicture)}`}
                        className="h-[90%] aspect-square rounded-full object-cover"
                    />
                </div>
                <div className="bg-stone-900 h-[70%] rounded-b-lg">
                    <div className="flex gap-5 justify-center items-center">
                        <div className="text-center font-bold underline decoration-current">Group Name : {friend.groupName}</div>

                        {console.log("the value is : ", friend.participants[0].relationId, info.profile.relationId)}
                        {friend.participants[0].relationId == info.profile.relationId ?

                            <div className="flex gap-2  items-center">
                                <div className="group relative">
                                    < MdDeleteForever className="size-5 hover:cursor-pointer text-red-700" />
                                    <span className="absolute top-0 left-6 bg-black px-2 py-1 opacity-0 text-sm z-10 rounded-md pointer-events-none group-hover:opacity-100"
                                        onClick={() => handleExit({ groupId: value.groupId })}>Delete the group</span>  {/* pointer-events-none means no event by the mouse */}
                                </div>
                                <div className="group relative">
                                    <IoMdPersonAdd className="size-5 text-green-700 hover:cursor-pointer" />
                                    <span className="absolute top-0 left-6 bg-black px-2 py-1 opacity-0 text-sm rounded-md pointer-events-none group-hover:opacity-100"
                                        onClick={() => handleAdd({ groupId: value.groupId })}>Add a member</span>  {/* pointer-events-none means no event by the mouse */}
                                </div>
                            </div> :
                            <div className="group relative">
                                < IoExit className="size-5 hover:cursor-pointer text-red-700" />
                                <span className="absolute top-0 left-6 bg-black px-2 py-1 opacity-0 text-sm rounded-md pointer-events-none group-hover:opacity-100"
                                    onClick={() => handleExit({ groupId: value.groupId })}>Exit from group</span>  {/* pointer-events-none means no event by the mouse */}
                            </div>}

                    </div>
                    <ul className="h-[70%] flex flex-col items-center gap-5 overflow-auto mt-5 font-serif">
                        {friend.participants.map((value, index) => {
                            return <li key={index} className="w-[70%] flex justify-between">
                                <div className="flex gap-2">
                                    <img src={`http://localhost:3000/uploads/${encodeURIComponent(value.profilePicture)}`} alt="" className="rounded-full w-8 aspect-square object-cover" />
                                    <div>{value.username}</div>
                                </div>
                                <div className="flex gap-5 items-center">{value.role}
                                    <MdDelete className="hover:cursor-pointer text-red-800 size-5" onClick={() => handleDelete({ groupId: friend.groupId, username: value.username, friendRelationId: value.relationId, participants: friend.participants, friendChatId: value.chatId, })} />
                                </div>
                            </li>
                        })}
                    </ul>

                </div>

            </div>
        </div>
    )
}

export default GroupInfo