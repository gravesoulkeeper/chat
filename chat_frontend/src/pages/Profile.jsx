import Navbar from "../components/Navbar"
import ProfileView from "../components/ProfileView"

const Profile = () => {
  return (
    <div className="lg:flex">
      <Navbar/>
      <ProfileView/>
    </div>
  )
}

export default Profile