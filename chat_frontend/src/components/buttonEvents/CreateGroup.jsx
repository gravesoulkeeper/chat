import { IoPersonCircleOutline } from "react-icons/io5";
import { useState, useEffect, useRef, useContext } from "react";
import { createSocket } from "../../context/socket";

import { getFriends, searchFriends, createGroup } from "../../services/api";

const CreateGroup = ({ setCreateGroup }) => {

    const [groupName, setGroupName] = useState("")
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [friends, setFriends] = useState([]);
    const [image, setImage] = useState(null);
    const lastElementRef = useRef(null);
    const [file, setFile] = useState({})
    const [page, setPage] = useState(1);
    const fileRef = useRef(null);

    const socket = useContext(createSocket);

    const fetchMoreFriends = async () => {
        setLoading(true);
        const [status, data] = await getFriends(page, 10);
        // console.log("the friends are : ", data);
        if (status) {
            setHasMore(data.length > 0)
            setPage(prevPage => prevPage + 1)
            setFriends(preFri => [...preFri, ...data]);
        }
        setLoading(false);
    }

    const onIntersection = (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
            fetchMoreFriends();
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if (observer && lastElementRef.current) {
            observer.observe(lastElementRef.current)
        }

        return () => {
            observer.disconnect();
        }
    }, [page])

    useEffect(() => {
        if (!file || !(file instanceof Blob)) return; // Ensure file is a valid Blob (File is a subclass of Blob)

        const objectUrl = URL.createObjectURL(file);
        setImage(objectUrl);

        return () => URL.revokeObjectURL(objectUrl); // Cleanup old URL
    }, [file]);


    const onCheck = (index) => {
        setFriends(prevItems =>
            prevItems.map((friends, i) =>
                i === index ? { ...friends, checked: !friends.checked } : friends
            )
        );
        // friends[index].checked = false;
        // setFriends(friends); //  React won't detect the change , it will not change the dom
    }

    const fileClick = () => {
        fileRef.current.click();
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        // console.log("file is : ", e.target.files[0])
    }

    const handleCreate = async () => {
        console.log("inside create group function...");
        if (!groupName || !image) return;
        const checkedFriends = friends
            .filter(user => user.checked) // Filter checked friends
            .map(user => ({ relationId: user.relationId, username: user.username, profilePicture: user.profilePicture })); // Extract relationId and username

        if (checkedFriends.length === 0) return;
        const formData = new FormData();
        formData.append('groupPicture', file);
        formData.append('groupName', groupName);
        formData.append('friends', JSON.stringify(checkedFriends));
        const [data, status] = await createGroup(formData); // { groupName, groupPicture, friends }
        const relationIds = checkedFriends.map(value => value.relationId)
        if (status) {
            socket.emit('create-group', { groupId: data, relationIds });
            setCreateGroup(false)
        }
    }
    
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70">
            <div className="absolute top-10 left-1/2  -translate-x-1/2 w-[35%] h-[90%] bg-neutral-900 rounded-md">
                <div className="h-[30%] flex flex-col items-center gap-3 pt-5">
                    <div onClick={fileClick} className="rounded-full bg-black text-black w-[22%] h-[70%] hover:cursor-pointer">
                        {image ? <img src={image} alt="" className="w-full h-full object-cover rounded-full" /> : <IoPersonCircleOutline className="w-full h-full object-cover rounded-full text-white" />}
                        <input type="file" ref={fileRef} onChange={handleFileChange} className="hidden" /> {/* just a reference to the actual div*/}
                    </div>
                    <input type="text"
                        className={`w-[60%] px-2 focus:outline-none rounded-md ${groupName.length < 5 ? "text-red-800" : "text-black"}`}
                        placeholder="Group name"
                        onChange={(e) => setGroupName(e.target.value)} />
                </div>
                <div className="bg-stone-900 w-full h-[60%] flex flex-col items-center">
                    {/* <input type="text" placeholder="Search friend" className="px-2 w-[60%] focus:outline-none rounded-md" /> */}
                    <ul className="w-full flex flex-col items-center gap-1 overflow-auto">
                        {friends.map((value, index) => (
                            !value.isGroup ?
                                <li key={index}
                                    className="w-[90%] mt-2 bg-neutral-950 font-bold text-white flex justify-between px-7 rounded-lg py-2">
                                    <div>{value.username}</div>
                                    <input
                                        type="checkbox"
                                        onChange={() => onCheck(index)}
                                        checked={Boolean(value.checked)} // Ensure it's always a boolean
                                        className="hover:cursor-pointer"
                                    />

                                </li> : null
                        ))}
                        <div ref={lastElementRef}></div>
                    </ul>

                </div>
                <div className="h-[10%] flex justify-center gap-5 bg-stone-900">
                    <button disabled={groupName.length < 5} className="bg-stone-600 hover:bg-stone-700 rounded-md h-[70%] px-2" onClick={handleCreate}>Create Group</button>
                    <button className="bg-stone-600 hover:bg-stone-700 rounded-md h-[70%] px-2" onClick={() => setCreateGroup(false)}>Cancel</button>
                </div>
            </div>

        </div>
    )
}

export default CreateGroup;