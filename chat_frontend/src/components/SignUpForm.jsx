import { useState, useContext } from 'react';
import logo from '/logo.svg'
// import { FcGoogle } from "react-icons/fc";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { signUp } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

//importing custom css 
import '../styles/responsive.css'

import { user } from '../context/profile'

const SignUpForm = () => {

    const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "", phoneNumber: "" })
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
    const info = useContext(user)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const navigate = useNavigate()
    const handleClick = async () => {
        const [status, data] = await signUp({
            username: form.username,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber
        })
        if (status) handleBack();
    }

    const handleBack = async () => {
        // window.location.href = '/'
        // navigate("/")
        window.location.href = "/"; // will reload the site


    }

    const togglPassword = (name) => {
        console.log("toggle system is working...", name)
        setShowPassword(prevPass => ({ ...prevPass, [name]: !prevPass[name] }))
    }

    return (
        <div className='bg-zinc-950 h-screen w-screen text-white'>
            <FaArrowLeft className='absolute top-2 left-5 text-2xl hover:cursor-pointer' onClick={handleBack} />
            <div className='flex flex-col items-center justify-center gap-5 h-full overflow-y-scroll scrollbar-none'>
                {/* Register */}
                <div className='2xl:w-[20%] xl:w-[25%] lg:w-[30%] md:w-[37%] sm:w-[44%] max-sm:w-[50%] width550px bg-neutral-900 border border-zinc-800 rounded-md flex flex-col items-center gap-5 pt-5 pb-8'>
                    <div className='flex justify-center items-center'>
                        <h2 className='text-xl'>Get started with</h2>
                        <img src={logo} alt="Chat" />
                    </div>
                    <div className='w-[85%] flex flex-col items-center gap-5'>

                        <div className='w-full'>
                            <input
                                type="email"
                                placeholder='Enter your email address'
                                value={form.email}
                                name='email'
                                onChange={handleChange}
                                autoComplete='off'
                                className='w-full bg-neutral-900 border-b border-zinc-800 focus:outline-none pr-5'
                            />
                            {/* <span className='text-red-800 text-sm'>email already exist!</span> */}
                            {/* <span className='text-red-800 text-sm'>invalid email!</span> */}
                        </div>

                        <div className='w-full'>
                            <input
                                type="text"
                                placeholder='Create username'
                                value={form.username}
                                name='username'
                                onChange={handleChange}
                                autoComplete='off'
                                className='w-full bg-neutral-900 border-b border-zinc-800 focus:outline-none pr-5'
                            />
                            <span className='text-red-800 text-sm'>{form.username.length != 0 && form.username.length < 5 ? "username is too short" : ""} </span>
                        </div>

                        <div className='w-full'>

                            <div className='w-full relative'>
                                <input
                                    type={showPassword.password ? "type" : "password"}
                                    value={form.password}
                                    name='password'
                                    placeholder='Create Password'
                                    onChange={handleChange}
                                    autoComplete='off'
                                    className='w-full h-9 pr-10 border-b border-zinc-800 focus:outline-none bg-neutral-900' />
                                <span className='absolute top-3 right-3'>
                                    {showPassword.password ?
                                        <IoMdEye onClick={() => togglPassword("password")} className={`text-xl hover:cursor-pointer ${form.password.trim().length > 0 ? '' : 'hidden'}`} /> :
                                        <IoMdEyeOff onClick={() => togglPassword("password")} className={`text-xl hover:cursor-pointer ${form.password.trim().length > 0 ? '' : 'hidden'}`} />
                                    }
                                </span>
                            </div>
                            <span className='text-red-800 text-sm'>{form.password != 0 && form.password.length < 6 ? "password is too short" : ""}</span>
                        </div>

                        <div className='w-full'>

                            <div className='w-full relative'>
                                <input
                                    type={showPassword.confirmPassword ? "type" : "password"}
                                    value={form.confirmPassword}
                                    name='confirmPassword'
                                    placeholder='Confirm Password'
                                    onChange={handleChange}
                                    autoComplete='off'
                                    className='w-full h-9 pr-10 border-b border-zinc-800 focus:outline-none bg-neutral-900' />
                                <span className='absolute top-3 right-3'>
                                    {showPassword.confirmPassword ?
                                        <IoMdEye onClick={() => togglPassword("confirmPassword")} className={`text-xl hover:cursor-pointer ${form.confirmPassword.trim().length > 0 ? '' : 'hidden'}`} /> :
                                        <IoMdEyeOff onClick={() => togglPassword("confirmPassword")} className={`text-xl hover:cursor-pointer ${form.confirmPassword.trim().length > 0 ? '' : 'hidden'}`} />
                                    }
                                </span>
                            </div>
                            <span className='text-red-800 text-sm'>{form.confirmPassword != 0 && form.password !== form.confirmPassword ? "password did't match" : ""}</span>
                        </div>

                        <div className='w-full'>

                            <input
                                type="tel"
                                placeholder='Phone number'
                                value={form.phoneNumber}
                                name='phoneNumber'
                                onChange={handleChange}
                                autoComplete='off'
                                className='w-full bg-neutral-900 border-b border-zinc-800 focus:outline-none pr-5'
                            />
                            <span className='text-red-800 text-sm'>{form.phoneNumber.length != 0 && form.phoneNumber.length < 10 ? "invalid number!" : ""}</span>

                        </div>

                        <button
                            disabled={form.password.length < 6 || form.password != form.confirmPassword || form.username.length < 5 || form.phoneNumber.length < 10}
                            onClick={handleClick}
                            className='w-full h-9 rounded-md bg-neutral-800 font-medium hover:bg-neutral-700 disabled:bg-neutral-800'>
                            Sign up
                        </button>
                    </div>
                </div>

                {/* Already have an account */}
                <div className='2xl:w-[20%] xl:w-[25%] lg:w-[30%] md:w-[37%] sm:w-[44%] max-sm:w-[50%] width550px min-h-[9vh] rounded-md border border-zinc-800 bg-neutral-900 flex justify-center items-center'>
                    <div className='text-[15px]'>Already have an account?
                        <Link to="/signin" className='font-medium text-sm hover:cursor-pointer hover:text-neutral-700 text-neutral-500'> Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUpForm