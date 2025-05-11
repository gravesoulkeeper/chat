import { useContext, useRef, useEffect } from 'react'
import { SetProfilePicture, GetProfilePicture } from '../services/api'
import { user } from '../context/profile'

//importing custom css
import '../styles/responsive.css'

const ProfileView = () => {
  const info = useContext(user)
  const fileRef = useRef()

  const handleDivClick = () => {
    // Trigger the hidden file input when the div is clicked
    fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    //Does user select a file and click open ?
    if (file) {
      handleAddImage(file)
    }
  }

  const handleAddImage = async (file) => {

    //Converting the file into formData
    console.log('oldProfilePicture', info.profile.profilePicture)
    const formData = new FormData();
    formData.append('profilePicture', file)
    formData.append('oldProfilePicture', info.profile.profilePicture)

    const status = await SetProfilePicture(formData)
    if (status) {
      console.log("Successfully ...")
    }
    handleGetProfilePicture()
  }

  const handleGetProfilePicture = async () => {
    const [status, profilePicture] = await GetProfilePicture()
    if (status) {
      //doing something
      console.log("New profilePicture is : ", profilePicture)
      info.setProfile(prevProfile => ({ ...prevProfile, profilePicture: profilePicture }))
    }
  }

  // # old Message ://we are doing this <user.Provider value={profile}> Not this <user.Provider value={{profile,setProfilePicture}}> so we can access that by info.name rather than info.profile.name

  return (
    <div className='w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] h-screen bg-zinc-950 text-white overflow-y-auto scrollbar-webkit'>
      {/*  Checking if user is logged in or not*/}
      {info.profile.auth ?
        //This is the profilePicture display setting
        <div className='py-10 gap-10 lg:px-14 xl:px-36 2xl:gap-20 lg:flex max-lg:gap-10 w-full'>
          <div className='text-center flex flex-col items-center'>
            {info.profile.profilePicture ?
              <div className='hover:cursor-pointer rounded-full flex justify-center' onClick={handleDivClick}>
                <img src={`http://localhost:3000/uploads/${info.profile.profilePicture}`} alt="" className='w-52 h-52 rounded-full object-cover mb-3' />
              </div> :
              <div className='rounded-full border w-52 mb-3' onClick={handleDivClick}>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='hover:cursor-pointer w-full h-full'>
                  {/* <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" fill="none" /> */}
                  <circle cx="100" cy="70" r="20" stroke="white" strokeWidth="2" fill="none" />
                  <path d="M 60 130 A 40 40 0 0 1 140 130" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </div>
            }
            <input
              type="file"
              ref={fileRef}
              className='hidden'
              accept="image/*"
              onChange={handleFileChange}
            />
            <span className='bg-neutral-900 rounded-md px-4'>Click to choose Photo</span>


          </div>

          {/* This will log the users detail */}

          <div className=' flex flex-col items-center gap-3 pt-7 lg:w-[70%] max-lg:w-[100%] w-full'>
            <div className='border border-zinc-800 bg-neutral-900 rounded-xl p-2  flex justify-between w-[70%] max-md:w-[90%] max-sm:w-[95%] nav400px gap-5'>
              <span>Name</span> <span className='font-medium'>{info.profile.username}</span></div>
            <div className='border border-zinc-800 bg-neutral-900 rounded-xl p-2  flex justify-between w-[70%] max-md:w-[90%] max-sm:w-[95%] nav400px gap-5'>
              <span>Email</span> <span className='font-medium'>{info.profile.email}</span></div>
            <div className='border border-zinc-800 bg-neutral-900 rounded-xl p-2  flex justify-between w-[70%] max-md:w-[90%] max-sm:w-[95%] nav400px gap-5'>
              <span>Phone Number</span> <span className='font-medium'>{info.profile.phoneNumber}</span></div>
          </div>

        </div>
        : <div className='mt-5 text-center font-medium'>sign in or sign up first to view (profile)</div>
      }
    </div>
  )
}

export default ProfileView
