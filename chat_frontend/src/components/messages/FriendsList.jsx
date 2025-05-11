import { useState, useRef, useEffect, useContext } from 'react'
import { createSocket } from '../../context/socket';
import { FaPeopleLine } from "react-icons/fa6";
import { getFriends } from "../../services/api"
import { IoPersonCircleOutline } from "react-icons/io5";
import CreateGroup from '../buttonEvents/CreateGroup';

//Importing a custom css
import './../../styles/responsive.css'

const MessagesFriendsList = ({ setFriend }) => {

    const [selectFriend, setSelectFriend] = useState(true)
    const [createGroup, setCreateGroup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [friends, setFriends] = useState([])
    const [page, setPage] = useState(1)
    const lastElementRef = useRef(null)

    const fetchMoreFriends = async () => {
        setLoading(true)
        const [status, data] = await getFriends(page, 10)
        console.log("Data : ", data)
        if (status) {
            setHasMore(data.length > 0)
            setPage(prevPage => prevPage + 1)
            setFriends(prevFri => [...prevFri, ...data])
        }
        setLoading(false)
    }

    const onIntersection = (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && !loading) {
            fetchMoreFriends()
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if (observer && lastElementRef.current) {
            observer.observe(lastElementRef.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [page])


    const handleSetFriendId = (value) => {
        setFriend(value)
        setSelectFriend(preValue => !preValue)
    }

    return (
        <div className='w-[20vw] max-lg:w-[100vw] max-lg:h-[5vh] bg-zinc-950 border-r border-zinc-800 h-screen text-white'>

            {/* For Pc */}
            <div className="h-full max-lg:hidden bg-black">
                <div className="h-[10%]" onClick={() => setCreateGroup((preValue) => !preValue)}>
                    <button className="bg-stone-800 hover:bg-stone-900 border-zinc-800 h-full w-full rounded-md px-3 text-sm ">Click to create new Group</button>
                </div>
                <ul className="overflow-y-auto h-[90%] scroll-smooth">
                    {friends.length == 0 && !loading && <div className="text-center mt-5">No, friends </div>}
                    {
                        friends.map((value, index) => {
                            return <li key={index}
                                onClick={() => handleSetFriendId(value)}
                                className="hover:cursor-pointer hover:bg-stone-800 my-3">
                                <div className="flex gap-3 items-center p-3">
                                    <div className={`rounded-full ${value.status == "online" ? " border-2 border-green-700" : ""}`}>
                                        {value.profilePicture || value.groupPicture ? <img src={`http://localhost:3000/uploads/${encodeURIComponent(value.profilePicture || value.groupPicture)}`} alt=""
                                            className='w-9 h-9 rounded-full object-cover' /> : <IoPersonCircleOutline className='text-4xl' />}
                                    </div>
                                    <span className="text-md font-medium">
                                        {value.username || value.groupName}
                                    </span>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>

            {/* For mobile */}
            <div className="lg:hidden h-full w-full bg-black flex justify-between items-center text-xl relative">
                <div className="flex gap-4 px-5 h-full bg-neutral-900 border-bg-zinc-800 rounded-md items-center" onClick={() => handleSelectFriend((preValue) => !preValue)} >
                    <FaPeopleLine className="text-3xl" />
                    <span className="">select friends</span>
                </div>

                <button className="bg-neutral-900 h-full rounded-md px-3" onClick={() => setCreateGroup((preValue) => !preValue)} >create group</button>
                {selectFriend && <div className="absolute top-[5vh] left-0 h-[85vh] md:w-[40%] sm:w-[50%] max-sm:w-[60%] width550px bg-black">
                    <ul className="overflow-y-auto h-full  scrollbar-webkit scroll-smooth">
                        {friends.length == 0 && !loading && <div className="text-center mt-5">No, friends </div>}
                        {
                            friends.map((value, index) => {
                                return <li key={index}
                                    onClick={() => handleSetFriendId(value)}
                                    className="bg-red- hover:cursor-pointer my-3">
                                    <div className="flex gap-3 items-center p-3">
                                        <img src={`http://localhost:3000/uploads/${value.profilePicture}`} alt=""
                                            className='w-9 h-9 rounded-full object-cover' />
                                        <span className="text-md font-medium">
                                            {value.username || value.groupName}
                                        </span>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div>}
            </div>

            <div ref={lastElementRef} className="text-center"></div>

            {/* Create New group */}
            {createGroup && <CreateGroup setCreateGroup={setCreateGroup} />}
        </div >
    )
}

export default MessagesFriendsList
