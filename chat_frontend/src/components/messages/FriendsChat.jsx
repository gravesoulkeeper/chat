import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import { getMessages } from '../../services/api';
import { IoSendSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { user } from '../../context/profile';
import { createSocket } from "../../context/socket";
import RemoveFriend from "../buttonEvents/RemoveFriend";
import GroupInfo from "../buttonEvents/GroupInfo";
import { LuInfo } from "react-icons/lu";


const MessagesChat = ({ friend }) => {
  const info = useContext(user);
  const [totalMsgs, setTotalMsgs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);

  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const socket = useContext(createSocket);
  const [messages, setMessages] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [scrollNow, setScrollNow] = useState(true);
  const [newMessagesFetched, setNewMessagesFetched] = useState(null); // Track scroll data

  const fetchMoreMessages = async () => {
    if (loading || !hasMore) return; // Fixed condition
    setLoading(true);
    // console.log("Fetching More messages ...");
    const [status, { msgs, total_msgs }] = await getMessages(page, 10, friend.senChatId, totalMsgs);
    if (status) {
      console.log('Messages is : ', msgs);

      const scrollContainer = scrollContainerRef.current;
      const scrollTopBefore = scrollContainer.scrollTop; // Current scroll position
      const scrollHeightBefore = scrollContainer.scrollHeight; // Height before new messages

      // Update messages (prepend new ones)
      setMessages(prevMess => [...msgs.reverse(), ...prevMess]);
      setPage(prevPage => prevPage + 1);
      setHasMore(msgs.length > 0);

      // Store scroll data for adjustment
      setNewMessagesFetched({ scrollTopBefore, scrollHeightBefore });
    }
    setLoading(false);
  };

  const initialFetch = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    console.log("fetching msg");
    const [status, { msgs, total_msgs }] = await getMessages(page, 10, friend.senChatId, totalMsgs);
    if (status) {
      setMessages(prevMess => [...msgs.reverse(), ...prevMess]);
      setScrollNow(true);
      setTotalMsgs(total_msgs);
      setPage(prevPage => prevPage + 1);
      setHasMore(msgs.length > 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    setTotalMsgs(0);
    initialFetch();
  }, [friend.relationId || friend.groupId]);

  const onIntersection = (entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore && !loading) {
      fetchMoreMessages();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (firstElementRef.current) {
      observer.observe(firstElementRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [page]);

  useLayoutEffect(() => {
    if (newMessagesFetched && scrollContainerRef.current) {
      const { scrollTopBefore, scrollHeightBefore } = newMessagesFetched;
      const scrollContainer = scrollContainerRef.current;
      const scrollHeightAfter = scrollContainer.scrollHeight;
      const heightAdded = scrollHeightAfter - scrollHeightBefore;

      // Adjust scroll position to maintain the same view
      scrollContainer.scrollTop = scrollTopBefore + heightAdded;

      setNewMessagesFetched(null); // Reset after adjustment
    }
  }, [newMessagesFetched]);

  useEffect(() => {
    scrollToBottom();
    setScrollNow(false);
  }, [scrollNow]);

  const scrollToBottom = () => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({ behavior: 'instant' });
      setTimeout(() => {
        lastElementRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  useEffect(() => {
    socket.on('receive-private-message', ({ chatId, msg }) => {
      if (chatId === friend.recChatId) {
        setMessages(prevMsg => [...prevMsg, { chatId, msg, timestamp: Date.now() }]);
      }
    }); 

    socket.on('receive-group-message', ({ groupId, chatId, username, msg }) => {
      console.log("msg receive from username : ", username)
      if (groupId === friend.groupId) {
        setMessages(prevMsg => [...prevMsg, { chatId, username, msg, timestamp: Date.now() }])
      }
    })
  }, []);

  const handleClick = async () => {
    if (text.trim().length === 0) return;
    setMessages(prevMsg => [...prevMsg, { chatId: friend.senChatId, msg: text, timestamp: Date.now() }]);
    setText("");
    const isGroup = friend.isGroup;
    if (isGroup) {
      socket.emit('send-group-message', { groupId: friend.groupId, senChatId: friend.senChatId, recChatId: friend.recChatId, msg: text })
    }
    else {
      socket.emit('send-private-message', { senChatId: friend.senChatId, recChatId: friend.recChatId, relationId: friend.relationId, msg: text });
    }
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleClick();
    }
  };

  return (
    <div className="w-[60vw] max-lg:w-[100vw] max-lg:h-[85vh] h-screen b-950">
      <div className="w-full h-[5%] bg-stone-800 flex justify-between">
        <h2 className="font-bold text-xl"> Chatting to : {friend.username || friend.groupName} </h2>
        <div className="flex gap-1 items-center justify-center hover:cursor-pointer p-2 mr-2 bg-stone-600 hover:bg-stone-700 rounded-sm">
          {!friend.isGroup && <div onClick={() => setConfirm(preValue => !preValue)} className="font-mono flex gap-2"><span>Remove Friend </span><MdDelete className="size-5"/></div>}
          {friend.isGroup && <div onClick={() => setConfirm(preValue => !preValue)} className="font-mono flex gap-2"><span>Group Info </span><LuInfo className="size-5"/></div>}
          {/* <MdDelete /> */}
          {confirm && !friend.isGroup && <RemoveFriend setConfirm={setConfirm} friend={friend} />}
          {confirm && friend.isGroup && <GroupInfo setConfirm={setConfirm} friend={friend} />}

        </div>
      </div>
      <div
        className="w-full h-[95%]"
        style={{
          backgroundImage: `url('http://localhost:3000/uploads/${encodeURIComponent(friend.profilePicture || friend.groupPicture)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="h-[93%]">
          <ul className="h-full p-1 overflow-y-auto" ref={scrollContainerRef}>
            <div className="text-center">{messages.length === 0 ? "No Messages" : ""}</div>
            {messages.map((value, index) => (
              <li
                key={index}
                ref={index === 0 ? firstElementRef : null}
                className={`${value.chatId === friend.senChatId ? "ml-[30%]" : "max-w-[70%]"} bg-stone-900 mb-2 px-3 py-1 rounded-md`}
              >
                <span>{value.msg}</span>
                <div className="flex justify-between gap-2">
                  <div className="text-[10px] text-green-300">{friend.isGroup && value.chatId != friend.senChatId ? value.username : ""}</div> {/*checking if this is a group or not and if the msg is sender msg or not */}
                  <div className="text-[10px] text-right text-blue-200">
                    {new Date(value.timestamp).getDate().toString().padStart(2, '0')} {new Date(value.timestamp).getHours() % 12 || 12}:{new Date(value.timestamp).getMinutes().toString().padStart(2, '0')}
                    {new Date(value.timestamp).getHours() >= 12 ? 'PM' : 'AM'}
                  </div>
                </div>
              </li>
            ))}
            <div ref={lastElementRef}></div>
          </ul>
        </div>
        <div className="h-[7%] w-full">
          <div className="flex justify-center items-center h-[80%] gap-3">
            <input
              type="text"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!friend.relationId}
              value={text}
              className="w-[75%] h-full rounded-2xl px-5 focus:outline-none border border-zinc-800 bg-neutral-900"
            />
            <IoSendSharp className="text-xl hover:cursor-pointer" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesChat;