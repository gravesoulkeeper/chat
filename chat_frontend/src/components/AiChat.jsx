import { useContext, useRef, useEffect, useState } from "react"
import AiMessages from "./messages/AiMessages";
import { user } from "../context/profile"
import { IoSend } from "react-icons/io5";
import { LuBrainCircuit } from "react-icons/lu";
import { createSocket } from "../context/socket";
import { BsFillSendFill } from "react-icons/bs";

//importing custom css
import '../styles/responsive.css'

const AiChat = () => {
  const [scrollNow, setScrollNow] = useState(true)
  const [text, setText] = useState("")
  const info = useContext(user)
  const textareaRef = useRef(null)

  const [messages, setMessages] = useState([])
  const socket = useContext(createSocket)
  useEffect(() => {
    socket.on('ai-response', (msg) => {
      console.log(msg)
      setMessages(prevMess => [...prevMess, { msg: msg, type: "ai" }])
      setScrollNow(true)
    })
  }, [])

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key == 'Enter' && !e.shiftKey) {
      handleSend()
    }
  }

  const handleSend = () => {
    socket.emit('ai', text)
    setMessages(prevMess => [...prevMess, { msg: text, type: "sender" }])
    setText("")
    setScrollNow(true)
  }

  return (
    info.profile.auth ? <div className='w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] bg-zinc-950 text-white flex flex-col items-center h-screen'>
      <div className="h-[10%] w-full flex items-center justify-between bg-red-">
        <div className="px-5 text-xl font-bold max-md:text-lg max-sm:text-sm nav500px">Talk to Alpha Ai </div>
        <div className="flex items-center max-sm:w-[50%]">
          <LuBrainCircuit className="size-8" />
          <div className="px-5 text-sm max-md:text-xs max-sm:text-[10px]">Alpha can make mistakes. Please double-check responses.</div>
        </div>

      </div>
      <div className="h-[80%] w-full flex justify-center overflow-auto ">
        <AiMessages messages={messages} scrollNow={scrollNow} setScrollNow={setScrollNow} />
      </div>
      <div className="h-[10%] w-full text-center flex justify-center">
        {/* <textarea */}
        <input
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          // disabled={}
          placeholder="Message to Alpha"
          className="bg-neutral-900 w-[60%] h-[70%]  rounded-2xl  px-8 focus:outline-none" />
        {/* </textarea> */}
        {/* <IoSend className="text-2xl" /> */}
        <div className="relative">

          <BsFillSendFill className="absolute top-3 right-4 size-5 hover:cursor-pointer" onClick={handleSend} />
        </div>
      </div>
    </div> :
      <div className="bg-zinc-950 w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] h-screen text-white text-center pt-5 font-medium">sign in or sign up first to chat with Alpha - AI</div>
  )
}

export default AiChat