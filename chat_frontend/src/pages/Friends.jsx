import Navbar from "../components/Navbar"
import FriendsList from "../components/FriendsList"

const Friends = () => {
  return (
    <div className='lg:flex'>
      <Navbar/>
      <FriendsList/>
    </div>
  )
}

export default Friends
