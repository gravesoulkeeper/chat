import React, { useState, useContext } from 'react'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { signIn } from '../services/api'
import { Link } from 'react-router-dom'
import logo from '/logo.svg'

// changing value of isLogin and navigate to another page
import { user } from '../context/profile'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";

//Importing custom css
import '../styles/responsive.css'

//importing user info

const SignInForm = () => {

    const [form, setForm] = useState({ email: "", password: "" })
    const info = useContext(user)
    const [auth, setAuth] = useState(true)
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setAuth(true)
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const navigate = useNavigate()
    const handleClick = async (e) => {
        const [status, data] = await signIn({
            email: form.email,
            password: form.password
        })
        if (status) {
            navigate('/')
            info.setProfile(data)
        }

        setAuth(data.auth)

    }

    const handleBack = async () => {
        // window.location.href = '/'
        navigate("/")
    }

    const togglPassword = () => {
        setShowPassword(prevPass => !prevPass)
    }

    return (
        <div className='bg-zinc-950 h-screen w-screen text-white'>
            <FaArrowLeft className='absolute top-2 left-5 text-2xl hover:cursor-pointer' onClick={handleBack} />
            <div className='flex flex-col items-center justify-center gap-5 h-full w-full overflow-y-scroll scrollbar-webkit minpadding550px'>
                <div className='2xl:w-[20%] xl:w-[25%] lg:w-[30%] md:w-[37%] sm:w-[44%] max-sm:w-[50%] width550px rounded-md border border-zinc-800 flex flex-col items-center gap-5 bg-neutral-900'>
                    <div className='flex justify-center items-center'>
                        <h2 className='text-2xl'>Sign in to</h2>
                        <img src={logo} alt="Chat" />
                    </div>

                    <div className='w-[85%]'>
                        <div>Email address</div>
                        <input
                            type="text"
                            value={form.email}
                            name='email'
                            onChange={handleChange}
                            autoComplete='off'
                            className='mt-3 w-full h-9 px-4 rounded-md border border-zinc-800 bg-neutral-900' />
                    </div>

                    <div className='w-[85%]'>
                        <div>Password</div>
                        <div className='w-full relative'>
                            <input
                                type={showPassword ? "type" : "password"}
                                value={form.password}
                                name='password'
                                onChange={handleChange}
                                autoComplete='off'
                                className='mt-3 w-full h-9 px-4 pr-10 rounded-md border border-zinc-800 bg-neutral-900' />
                            <span className='absolute top-5 right-3'>
                                {showPassword && form.password.trim().length > 0 ?
                                    <IoMdEye onClick={togglPassword} className={`text-xl hover:cursor-pointer ${form.password.trim().length > 0 ? '' : 'hidden'}`} /> :
                                    <IoMdEyeOff onClick={togglPassword} className={`text-xl hover:cursor-pointer ${form.password.trim().length > 0 ? '' : 'hidden'}`} />
                                }
                            </span>
                        </div>
                    </div>
                    <div className='w-[85%] text-sm flex justify-between'>
                        <span className='hover:cursor-pointer hover:text-neutral-400'>Forget Password?</span>
                        {!auth && <span className='text-red-800'>Incorrect credentials</span>}
                    </div>
                    <button
                        onClick={handleClick}
                        className='w-[85%] h-9 rounded-md bg-neutral-800 font-medium hover:bg-neutral-700 disabled:bg-neutral-800 mb-7'>Sign in
                    </button>
                </div>

                <div className='2xl:w-[20%] xl:w-[25%] lg:w-[30%] md:w-[37%] sm:w-[44%] max-sm:w-[50%] width550px min-h-[9vh] rounded-md border border-zinc-800 bg-neutral-900 flex justify-center items-center'>
                    <div className='text-[15px]'>Don't have an account?
                        <Link to="/signup" className='font-medium text-sm hover:cursor-pointer hover:text-neutral-700 text-neutral-500'> Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInForm