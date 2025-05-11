import Navbar from "../components/Navbar"
import MessagesList from "../components/MessagesList"

const Messages = () => {
  return (
    <div className="lg:flex">
      <Navbar/>
      <MessagesList/>
    </div>
  )
}

export default Messages
