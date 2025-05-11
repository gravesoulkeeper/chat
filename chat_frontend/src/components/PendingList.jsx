import { useContext, useEffect, useState, useRef } from 'react'
import { user } from '../context/profile'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { getPendings, removePending } from '../services/api';
import { BsPerson } from "react-icons/bs";

const PendingList = () => {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [pendings, setPendings] = useState([])
  const lastElementRef = useRef(null)
  const [page, setPage] = useState(1)
  const info = useContext(user)

  const fetchMorePendings = async () => {
    // console.log("Inside the function ...")
    setLoading(true)
    const [status, data] = await getPendings(page)
    if (status) {
      setHasMore(data.length > 0)
      setPage(prevPage => prevPage + 1)
      setPendings(prevPendings => [...prevPendings, ...data])
    }
    setLoading(false)
  }

  const onIntersection = (entries) => {
    const firstEntry = entries[0]
    if (firstEntry.isIntersecting && hasMore && !loading) {
      fetchMorePendings()
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

  const handleRemove = async (receiver) => {
    for (let i = 0; i < pendings.length; i++) {
      if (pendings[i].relationId == receiver.relationId) {
        pendings.splice(i, 1) //index , number of elements (It won't create a new array,unlike slice(startIndex,endIndex))
        setPendings([...pendings])
        break
      }
    }

    await removePending(receiver)
  }

  return (
    <div className='w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] bg-zinc-950 text-white overflow-hidden'>
      {/* Verifying if user is logged in or not */}
      <div className='flex flex-col items-center h-screen'>
        <h2 className='mt-5'>{pendings.length > 0 ? "Pending Lists" : "No, Pending requests"}</h2>

        <div className='overflow-y-auto w-full scrollbar-webkit scroll-smooth'>

          {/* Friends */}
          <ul className='w-full flex flex-col items-center gap-5 mb-5 mt-5'>

            {info.profile.auth &&
              // Object.entries(requests).map(([key, value])=>{})
              pendings.map((value, index) => {
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
                  <RiDeleteBin5Fill onClick={() => { handleRemove({ relationId: value.relationId, username: value.username, profilePicture: value.profilePicture }) }} className='text-xl hover:cursor-pointer' />
                </li>
              })
            }
            <div ref={lastElementRef} className='text-center'>{loading && <span>Loading more pendings...</span>}</div>
          </ul>
        </div>
        <h2 className='text-center font-medium'>{!info.profile.auth && "sign in or sign up first to view (pendings)"}</h2>
      </div>

    </div>
  )
}

export default PendingList