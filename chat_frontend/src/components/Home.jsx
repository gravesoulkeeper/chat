
const Home = () => {
  return (
    <div className="w-[80vw] max-lg:w-[100vw] max-lg:h-[90vh] max-lg:text-[12px] max-xl:text-sm h-screen bg-zinc-950 text-white">
      <div className="overflow-y-auto h-full scrollbar-webkit">
        <div className="p-3 lg:flex lg:gap-5">
          <img src="/chatImage3.png" alt="" className="lg:w-[50%] w-full" />
          <p className="bg-stone-900 p-2 rounded-xl">At ChatStream, we believe that meaningful conversations deserve to be private, secure, and effortless. Our platform is built with cutting-edge encryption technology, ensuring that your personal information remains confidential and protected from unauthorized access. With a seamless and intuitive interface, ChatStream offers a smooth chatting experience across all your devices, allowing you to connect with friends, family, and colleagues without compromising your privacy. Your security is our top priority, and we are committed to creating a space where open communication thrives with full peace of mind.</p>
        </div>
        
        <div className="p-3 flex lg:gap-5 max-lg:flex-col">
          <p className="bg-stone-900 p-2 rounded-xl max-lg:order-2">We are committed to providing a secure and reliable platform for all our users. If you happen to discover any vulnerabilities, security issues, or potential risks within our platform, we encourage you to reach out to us immediately at <span className="text-blue-400">deepestlabyrinth@gmail.com</span>. Your insights help us enhance our security and keep our platform safe for everyone.
          <br />
            For general inquiries, feedback, or support, feel free to contact us through the same email or visit our Help Center. We take all reports seriously and will work swiftly to address any concerns. Thank you for helping us maintain the integrity and safety of our community at ChatStream.
          </p>
          <img src="chatImage1.png" alt="" className="lg:w-[50%] w-full order-1" />
        </div>
      </div>
    </div>
  )
}

export default Home
