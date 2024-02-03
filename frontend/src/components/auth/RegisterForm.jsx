import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from './userSclice';
import { login } from './Authstore';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is set to 'user'
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleRegister = async() => {

    const response = await fetch(`${import.meta.env.VITE_URL}/api/v1/users/register`,{
      method:'POST',headers: {
        'Content-Type': 'application/json',
        },body:JSON.stringify({email:email,password:password,role:role,name:name})
    })

    if(response.ok){

      const data = await response.json();
      // console.log(data)
      const token = data.token;
      dispatch(setUserProfile({userProfile:data.user}))
      console.log(data.user)
      Cookies.set('token',token);
      dispatch(login())
      navigate('/')
    }

    // console.log('Registering with:', { name, email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-600">
            Role
          </label>
          <select
            id="role"
            className="mt-1 p-2 w-full border rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          className="bg-white border-2 border-green-300 hover:bg-green-100 text-green-500 font-bold py-2 px-4 rounded"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
