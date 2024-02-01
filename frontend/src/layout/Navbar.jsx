import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../components/auth/Authstore';
import { clearUserProfile } from '../components/auth/userSclice';
// import Dropdown from './Dropdown.jsx';
// import { useSelector } from 'react-redux';
function Navbar() {


  const user = useSelector((state) => state.user.userProfile)
  let role = user ? user.userProfile.role : "";
  
  // // console.log(user)
  // // let role = "admin"
  // let  role = ""
  if(user){
     role = user.userProfile.role
  }
  // // role = user.userProfile.role

  const navigate = useNavigate()
  // const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch()
  const isLogin = useSelector((state) => state.auth.isLogin)
  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      dispatch(login())
      role = user.userProfile.role
    }
  }, [dispatch]);

  const handleLogout = async () => {

    Cookies.remove('token')
    dispatch(logout())
    navigate('/')
    dispatch(clearUserProfile())
  }

  return (
    <nav className=" bg-gray-900 p-4 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
        Dash-Deals
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white">
            Home
          </Link>
          {role == 'admin' ? (
            isLogin && (
              <Link to="/admin" className="text-white">
                Admin
              
              </Link>
            )
          ) : (
            <Link to="/cart" className="text-white">
              Cart
            </Link>

          )}

          {isLogin && role!="admin" ?(<Link to="/myorders" className="text-white">
            My Orders
          </Link>):""}
          {!isLogin && (
            <>
              <Link to="/login" className="text-white">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </>
          )}
          {isLogin && (
            <Link to="/profile" className="text-white">
              Profile
            </Link>
          )}
          {isLogin && <Link onClick={handleLogout} to="/" className="text-white">
            
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style={{fill:'white'}} d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
          </Link>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
