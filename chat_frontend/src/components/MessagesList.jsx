import FriendsList from "./messages/FriendsList"
import FriendsChat from "./messages/FriendsChat"
import { useContext, useEffect, useState } from "react"
import { user } from "../context/profile"

const MessagesList = () => {
  // this is the friend reference dependend to the sender , means it is from the sender friend list
  const [friend, setFriend] = useState({})
  const info = useContext(user)

  return (
    info.profile.auth ? <div className='bg-zinc-950 w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] text-white lg:flex'>
      <FriendsList setFriend={setFriend} />
      {friend.relationId ? <FriendsChat friend={friend} /> : <div className="bg-zinc-950 w-[60vw] max-lg:w-[100vw] max-lg:h-[85vh] h-screen p-5 text-center">Rest assured, your chats are secure and protected, allowing you to connect freely without any worries. Select your friends and start chatting today</div>}
    </div>
      : <div className="bg-zinc-950 w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] text-white text-center p-5 font-medium" >sign in or sign up first to view (chat)</div>
  )
}

export default MessagesList
