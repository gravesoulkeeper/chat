import { RouterProvider } from 'react-router-dom'
import router from './router/router'

//Easily global access to users status
import { useState, useEffect, useMemo } from 'react'
import { isLoggedIn } from './services/api'
import { io } from 'socket.io-client'
import { createSocket } from './context/socket'
import { user } from './context/profile'

function App() {

  const ip = "http://localhost:3000"

  const socket = useMemo(() => io(`${ip}`, { transports: ['websocket'] }), []);
  const [profile, setProfile] = useState([])

  useEffect(() => {
    const checkLoginStatus = async () => {
      const [status, data] = await isLoggedIn();
      if (status) setProfile(data)
    };

    checkLoginStatus();

    socket.on('connect', () => {
      socket.emit('register');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      socket.off('connect');
    };
  }, [])

  return (

    <createSocket.Provider value={socket}>
      <user.Provider value={{ profile, setProfile }}>
        <RouterProvider router={router} />
      </user.Provider>
    </createSocket.Provider >

  )
}

export default App 