import { useState, useEffect, useRef, useContext } from 'react';
import { sendRequest, search } from '../services/api';
import { MdPersonAdd } from "react-icons/md";
import { BsPerson } from "react-icons/bs";

import { user } from '../context/profile'

const SearchResults = () => {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const lastElementRef = useRef(null);
    const info = useContext(user)

    const fetchMoreUsers = async () => {
        if (username.trim().length === 0) return
        setLoading(true)

        console.log("Fetching more users...")
        const [status, data] = await search(username, page)
        if (status) {
            console.log("Server : ", data)
            console.log(`page : ${page}`)
            setHasMore(data.length > 0)
            setPage(prevPage => prevPage + 1)
            setUsers(prevUsers => [...prevUsers, ...data])
        }
        console.log("Users : ", users)
        console.log(`users.length : ${users.length} \n hasMore : ${hasMore}`)
        setLoading(false)
    }

    const onIntersection = (entries) => {
        const firstEntry = entries[0]
        // console.log(entries)
        // console.log(entries[0])
        if (firstEntry.isIntersecting && hasMore) {
            fetchMoreUsers()
        }
    }

    //This will run when the username changes 
    useEffect(() => {
        if (!info.profile.auth) return
        // console.log("value : ", value.login)
        // debouncing
        const timeoutId = setTimeout(() => {
            //because of !loading when the username is empty it makes teh setUsers empty!!!
            if (!loading) {
                setUsers([]);
                setPage(1);
                setHasMore(true);
                fetchMoreUsers();
            }
        }, 300)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [username, info.profile.auth])

    //This will observer the last element and load the data as per needed 
    useEffect(() => {
        if (!info.profile.auth) return
        const observer = new IntersectionObserver(onIntersection
            , { threshold: 0 }
        )
        if (observer && lastElementRef.current) {
            observer.observe(lastElementRef.current)
        }

        return () => {
            observer.disconnect() //Disconnect the observer
        }

    }, [page])

    const handleChange = (e) => {
        console.log("valeuis : ",e)
        setUsername(e.target.value);
    }

    // Handling the add or follow
    const handleAdd = async (receiver) => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].receiverId == receiver.receiverId) {
                users.splice(i, 1) //index , number of elements (It won't create a new array,unlike slice(startIndex,endIndex))
                setUsers([...users])   //Users is already change the only reason to do setUsers([]) because it will re-render the page to actually see it
                break
            }
        }
        sendRequest(receiver)
    }

    return (
        <div className='w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] h-screen bg-zinc-950 flex justify-center text-white'>
            {!info.profile.auth && <div className='mt-4 font-medium'>sign in or sign up first to view (search)</div>}
            {info.profile.auth &&
                <div className='w-full flex flex-col items-center gap-5'>
                    <input
                        type="text"
                        placeholder='Search by username'
                        value={username}
                        onChange={handleChange}
                        autoComplete='off'
                        className='bg-neutral-900 border border-zinc-800 focus:outline-none w-[60%] mt-5 rounded-2xl px-3 py-2'
                    />
                    <div className='overflow-y-auto w-full mt-5 scroll-smooth'>
                        <ul className='flex flex-col items-center gap-5 mb-5 w-full'>
                            {/* BUG Node:username.length>0 ,to preving the name to render again even after the username is 0 */}
                            {username && users.map((value, index) => (
                                <li
                                    key={index}
                                    // ref={users.length === index + 1 ? lastElementRef : null}  It is causing a bug if the username is more that 3 character the users wont appear
                                    className='bg-neutral-900 border border-zinc-800 rounded-2xl w-[80%] max-sm:w-[90%] h-10 px-5 py-1 flex justify-between items-center'>
                                    <div className='font-medium flex items-center gap-2'>
                                        {value.profilePicture ?
                                            <img src={`http://localhost:3000/uploads/${encodeURIComponent(value.profilePicture)}`}

                                                alt="" className='w-7 h-7 rounded-full object-cover' /> :
                                            <BsPerson />
                                        }
                                        <span>{value.username}</span>
                                    </div>
                                    {value.isFriend ? "" :
                                        <MdPersonAdd onClick={() => handleAdd({ relationId: value.relationId, username: value.username, profilePicture: value.profilePicture })}
                                            className='size-6  hover:cursor-pointer' />}
                                </li>
                            ))}
                            {username.trim() === "" && <li>Find your friends</li>}
                            {!loading && username.trim() != "" && users.length === 0 && <span>No username found</span>}
                            <div ref={lastElementRef}>{loading && <span>Loading more users...</span>}</div>
                        </ul>
                    </div>
                </div>}
        </div>
    );
};

export default SearchResults;
