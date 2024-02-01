import React from 'react'
import NavBar from './layout/Navbar'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import ProductList from './components/products/ProductList'
import UserOrders from './components/orders/UserOrders'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Home from './pages/Home'
import ProductDetails from './components/products/ProductDetails'
import Profile from './components/auth/Profile'
import OrderDetails from './components/orders/OrderDetails'
import Cart from './components/orders/Cart'
import Admin from './components/admin/Admin'
// import ProductModal from './components/admin/ProductModal'
import AdminOrders from './components/admin/AdminOrders'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
// import Footer from './layout/Footer'
function App() {
  return (
    <div >
       <Router>
      <NavBar/>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/products" element={<ProductList/>} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path="/myorders" element={<UserOrders/>} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/product/:productId" element={<ProductDetails/>} />
        <Route path='/myorders' element={<UserOrders/>}/>
        <Route path='/myorders/:orderId' element={<OrderDetails/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/adminorders' element={<AdminOrders/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/cancel' element={<Cancel/>}/>
        {/* <Route path='/cancel' element={<Cancel/>}/> */}
      </Routes>
      
    </Router>
    </div>
  )
}

export default App
