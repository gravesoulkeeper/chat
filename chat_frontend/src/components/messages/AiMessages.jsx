import { useEffect, useRef } from "react"

const AiMessages = ({ messages, scrollNow, setScrollNow }) => {
    const scrollContainerRef = useRef(null)

    useEffect(() => {
        if (scrollNow) {
            scrollContainerRef.current.scrollIntoView({ behavior: 'smooth' })
            setScrollNow(false)
        }
    }, [scrollNow])
    return (
        <div className="h-full w-[60vw] max-lg:w-[80vw]">
            {messages.length == 0 && <div className=" mt-28 text-center font-bold text-3xl">Where should we start?
            </div>}
            {messages.length ==0 && <div className="text-center font-medium text-sm mt-5">(It uses Meta llama3-8b-8192 api)</div>}
            {
                messages.map((value, index) => {
                    return <div
                        key={index}
                        style={{ whiteSpace: 'pre-wrap' }} //Helps in retreive the space
                        dangerouslySetInnerHTML={{ __html: value.msg }}
                        className={`my-5 rounded-xl p-5 ${value.type == "sender" ? "ml-[20vw] bg-stone-600" : ""}`}
                    />
                })
                
            }
            <div ref={scrollContainerRef}></div>
        </div>
    )
}

export default AiMessages

{/* < div
    style = {{ whiteSpace: 'pre-wrap' }}
    dangerouslySetInnerHTML = {{ __html: messages }}
/> */}
