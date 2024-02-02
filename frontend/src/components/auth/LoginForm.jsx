import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { login } from './Authstore';
import { setUserProfile } from './userSclice.js';
const LoginForm = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state)=>state.auth.isLogin)
  const user = useSelector((state)=>state.user.userProfile)

  useEffect(() => {
    console.log(isLogin)
    console.log(user)
    const token = Cookies.get("token")
    if(token){
      navigate('/')
    }

  }, [isLogin])
  
 

  const handleLogin = async() => {
    const response = await fetch('https://ecommerce-kdk6.onrender.com/api/v1/users/login',{
      method:'POST',headers: {
        'Content-Type': 'application/json',
        },body:JSON.stringify({email:email,password:password})
    })

    if(response.ok){

      const data = await response.json();
      // console.log(data)
      const token = data.token;
      dispatch(setUserProfile({userProfile:data.user}))
      console.log(user)
      console.log(token)
      console.log(data)
      Cookies.set('token',token);
      dispatch(login())
      navigate('/')
    }

      
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-white border-2 border-green-300 hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
