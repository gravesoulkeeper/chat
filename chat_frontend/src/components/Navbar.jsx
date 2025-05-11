import { useContext, useState } from 'react'
import logo from '/logo.svg'

//Importing some react icons
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from 'react-icons/rx';

import { GrHomeRounded } from "react-icons/gr";
import { GiBrain } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { BsSearch } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

//Importing custom css
import '../styles/responsive.css';

//Link for fast Navigation no page reload
import { Link } from 'react-router-dom';

//Checking if user isLogin 
import { user } from '../context/profile';

//Remove user
import { signOut } from '../services/api';

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)
  const info = useContext(user)
  // const links =
  //   [{ name: "Home",      link: "/" },
  //   { name: "Alpha - AI", link: "/ai" },
  //   { name: "Messages",   link: "/messages" },
  //   { name: "Search",     link: "/search" },
  //   { name: "Pending",    link: "/pending" },
  //   { name: "Friends",    link: "/friends" },
  //   { name: "Requests",   link: "/requests" },
  //   { name: "Profile",    link: "/profile" }]

  const handleSignOut = async () => {
    const status = await signOut()
    if (status) {
      info.setProfile({ ...info.profile, auth: false })
    }
  }


  const onClickHamburger = () => {
    setShowNav(prevNav => !prevNav)
  }

  return (
    <div
      className='w-[20vw] h-screen bg-black overflow-y-auto overflow-hidden scrollbar-webkit border-x border-neutral-800 text-white max-lg:w-[100vw] max-lg:h-[10vh]'>  {/* bg-zinc-950 */}
      <nav className='font-normal h-full px-3 my-2 max-lg:hidden'>
        <ul className='flex flex-col gap-4 list-none'>
          {/* bg-neutral-900 */}
          <li> <Link className='flex gap-5 items-center pl-5 mt-2 pt-2 rounded-md font-medium text-xl max-xl:text-lg max-xl:gap-3'>
            <span className=''>ChatStream</span><img src={logo} alt="" className='h-12' />
          </Link> </li>

          <li> <Link to="/" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <GrHomeRounded className='text-xl' /><span>Home</span>
          </Link> </li>

          <li> <Link to="/ai" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <GiBrain className='text-xl' /><span>Alpha - AI</span>
          </Link> </li>

          <li> <Link to="/messages" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <FiMessageSquare className='text-xl' /><span>Messages</span>
          </Link> </li>

          <li> <Link to="/search" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <BsSearch className='text-xl' /><span>Search</span>
          </Link> </li>

          <li> <Link to="/pendings" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <MdOutlinePendingActions className='text-xl' /><span>Pendings</span>
          </Link> </li>

          <li> <Link to="/requests" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <IoPersonAddSharp className='text-xl' /><span>Requests</span>
          </Link> </li>

          <li> <Link to="/profile" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
            <IoPerson className='text-xl' /><span>Profile</span>
          </Link> </li>

          {/* Sign in --> Allowing users to access their existing account. , Sing up --> The process of creating a new account for new users.*/}
          <li className=''>
            {/* Using condition rendering for optmize the rendering */}
            {info.profile.auth ? (
              <button onClick={handleSignOut} className='py-3 px-5 mr-36 min-w-28 bg-zinc-900 hover:bg-zinc-800 rounded-md'>Sign out</button>
            ) : (
              <div className='flex gap-2 items-center hover:bg-zinc-00 rounded-md '>
                <Link to="/signin" className='py-3 px-5 bg-zinc-900 hover:bg-zinc-800 rounded-md'>Sign in</Link>
                <Link to="/signup" className='py-3 px-5 bg-zinc-900 hover:bg-zinc-800 rounded-md'>Sign up</Link>
              </div>
            )}
          </li>

        </ul>
        <div className='text-white py-3 text-[13px] max-xl:text-[11px]'>© 2024 Vivaan. All rights reserved.</div>
      </nav>
      <nav className='lg:hidden max-sm:text-sm'>
        <div className='flex justify-between w-full items-center px-2'>
          <GiHamburgerMenu onClick={onClickHamburger} className='text-2xl m-2' />
          {info.profile.auth ? (
            <button onClick={handleSignOut} className='px-4 py-1 bg-zinc-900 hover:bg-zinc-800 rounded-xl'>Sign out</button>
          ) : (
            <div className='flex gap-2 items-center hover:bg-zinc-00 rounded-md '>
              <Link to="/signin" className='px-4 py-1 bg-zinc-900 hover:bg-zinc-800 rounded-xl'>Sign in</Link>
              <Link to="/signup" className='px-4 py-1 bg-zinc-900 hover:bg-zinc-800 rounded-xl'>Sign up</Link>
            </div>
          )}
        </div>


        {
          showNav &&
          <div className='fixed top-0 left-0 bg-black w-[30vw] overflow-auto h-full md:pl-5 max-sm:w-[50vw] nav320px z-10'>   {/* z-50 for apper on top of every body...*/}
            <RxCross1 className='text-2xl absolute top-1 left-3' onClick={onClickHamburger} />
            <ul
              className='flex flex-col gap-5'>
              <li> <Link className='flex gap-5 text-xl items-center pl-5 mt-8 pt-2 rounded-md font-medium max-xl:bg-red- max-xl:text-lg max-xl:gap-3'>
                <span className=''>ChatStream</span><img src={logo} alt="" className='h-12 max-lg:h-10' />
              </Link> </li>

              <li> <Link to="/" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <GrHomeRounded className='text-xl' /><span>Home</span>
              </Link> </li>

              <li> <Link to="/ai" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <GiBrain className='text-xl' /><span>Alpha - AI</span>
              </Link> </li>

              <li> <Link to="/messages" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <FiMessageSquare className='text-xl' /><span>Messages</span>
              </Link> </li>

              <li> <Link to="/search" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <BsSearch className='text-xl' /><span>Search</span>
              </Link> </li>

              <li> <Link to="/pendings" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <MdOutlinePendingActions className='text-xl' /><span>Pending</span>
              </Link> </li>

              <li> <Link to="/friends" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <FaUserFriends className='text-xl' /><span>Friends</span>
              </Link> </li>

              <li> <Link to="/requests" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <IoPersonAddSharp className='text-xl' /><span>Requests</span>
              </Link> </li>

              <li> <Link to="/profile" className='flex gap-5 items-center px-5 py-3 hover:bg-zinc-900 rounded-md'>
                <IoPerson className='text-xl' /><span>Profile</span>
              </Link> </li>
            </ul>
          </div>
        }
      </nav>
    </div>
  )
}

export default Navbar