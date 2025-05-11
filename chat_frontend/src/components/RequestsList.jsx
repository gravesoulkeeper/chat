import { useContext, useEffect, useState, useRef } from 'react'
import { getRequests, acceptRequest, removeRequest } from '../services/api'
import { user } from '../context/profile'
import { MdPersonAddAlt1 } from "react-icons/md";
import { MdPersonRemove } from "react-icons/md";
import { BsPerson } from "react-icons/bs";


const RequestsList = () => {

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [requests, setRequests] = useState([])
  const lastElementRef = useRef(null)
  const [page, setPage] = useState(1)
  const info = useContext(user)

  const fetchMoreRequest = async () => {
    console.log("Fetching more data...")
    setLoading(true)
    const [status, data] = await getRequests(page)
    console.log(data)
    if (status) {
      setHasMore(data.length > 0)
      setPage(prevPage => prevPage + 1)
      setRequests(prevReq => [...prevReq, ...data])
    }
    setLoading(false)
  }

  const onIntersection = (entries) => {
    const firstEntry = entries[0]
    console.log(firstEntry)
    if (firstEntry.isIntersecting && hasMore && !loading) {
      fetchMoreRequest()
    }
  }

  useEffect(() => {
    if (!info.profile.auth) return
    const observer = new IntersectionObserver(onIntersection)
    if (observer && lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [page, info.profile.auth])

  const handleAdd = async (receiver) => {
    for (let i = 0; i < requests.length; i++) {
      if (requests[i].relationId == receiver.relationId) {
        requests.splice(i, 1) //index , number of elements (It won't create a new array,unlike slice(startIndex,endIndex))
        setRequests([...requests])
        break
      }
    }
    await acceptRequest(receiver)
  }

  const handleRemove = async (receiver) => {
    for (let i = 0; i < requests.length; i++) {
      if (requests[i].relationId == receiver.relationId) {
        requests.splice(i, 1) //index , number of elements (It won't create a new array,unlike slice(startIndex,endIndex))
        setRequests([...requests])
        break
      }
    }
    await removeRequest(receiver)
  }

  return (
    <div className='w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] bg-zinc-950 text-white overflow-y-auto'>
      {/* Verifying if user is logged in or not */}
      <div className='flex flex-col items-center h-screen'>
        <h2 className='mt-5'>{requests.length > 0 ? "Friend requests" : "No, friend requests"}</h2>

        <div className='overflow-y-auto w-full scrollbar-webkit scroll-smooth'>

          {/* Friends */}
          <ul className='w-full flex flex-col items-center gap-5 mb-5 mt-5'>

            {info.profile.auth &&
              // Object.entries(requests).map(([key, value])=>{})
              requests.map((value, index) => {
                return <li
                  key={index}
                  className='border border-zinc-800 bg-neutral-900 py-2 px-5 rounded-2xl flex items-center justify-between w-[80%]'>
                  <div className='font-medium flex items-center gap-2'>
                    {value.profilePicture ?
                      <img src={`http://localhost:3000/uploads/${value.profilePicture}`}
                        alt="" className='w-7 h-7 rounded-full object-cover' /> :
                      <BsPerson />
                    }
                    <span>{value.username}</span>
                  </div>
                  <div className='flex gap-6'>
                    <MdPersonAddAlt1 onClick={() => { handleAdd({ relationId: value.relationId, username: value.username, profilePicture: value.profilePicture }) }} className='text-xl hover:cursor-pointer' />
                    <MdPersonRemove onClick={() => { handleRemove({ relationId: value.relationId, username: value.username, profilePicture: value.profilePicture }) }} className='text-xl hover:cursor-pointer' /></div>
                </li>
              })
            }
            <div ref={lastElementRef} className='text-center p-4'>{loading && <span>Loading more requests...</span>}</div>
          </ul>
        </div>
        <h2 className='text-center font-medium'>{!info.profile.auth && "sign in or sign up first to view (requests)"}</h2>
      </div>

    </div>
  )
}

export default RequestsList