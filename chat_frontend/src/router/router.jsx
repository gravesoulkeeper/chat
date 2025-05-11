import { createBrowserRouter } from 'react-router-dom'

//Importing all the Navbar
import Chat from '../pages/Chat'
import Ai from '../pages/Ai'
import Messages from '../pages/Messages'
import Search from '../pages/Search'
import Pending from '../pages/Pending'
import Requests from '../pages/Requests'
import Profile from '../pages/Profile'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'


const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />
    },
    {
        path: '/ai',
        element: <Ai />
    },
    {
        path: "/messages",
        element: <Messages />
    },
    {
        path: "/search",
        element: <Search />
    },
    {
        path: "/pendings",
        element: <Pending />
    },
    {
        path: "/requests",
        element: <Requests />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: "/signin",
        element: <SignIn />
    },
    {
        path: "/signup",
        element: <SignUp />
    },

])

export default router
