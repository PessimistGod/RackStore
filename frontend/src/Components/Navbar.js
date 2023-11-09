import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import {BiCartAlt} from 'react-icons/bi'
import {CgProfile} from 'react-icons/cg'
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const { cartCount } = useCart();
  const [name, setName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name)
      setIsAdmin(decodedToken.isAdmin)
    }else {
      setName(null);
    }
  }, [navigate])
  
  function handleLogout (){
    localStorage.removeItem('token')
    setName(null);
    navigate('/login')
  }

  return (
    <div className='navbar-bg container'>
      <div className='content'>
        <div className='logo-img'>
          <img src="" alt="Img" />
        </div>
        <div className='logo-text'>
          Logo
        </div>
        <span className='right-line'></span>
      </div>

      { (isAdmin && name )?(
        <>
        <div className='flexCenter'>

        <Link to={'/admin-orders'} className='admin-view'>View Orders</Link>
        <span className='right-line'></span>
        <Link to={'/admin-create'} className='admin-view'>Create Rack</Link>
        </div>

        <div className='flexCenter'>
          <div><CgProfile size={20}/></div>
          <div>{name}</div>
          <span className='right-line'></span>

          <div className='logout' onClick={handleLogout}>Logout</div>
        </div>

        
        </>
      ):
      (name) ? (
      <>
      <div className='navigators flexCenter'>
        <Link to="/">Home</Link>
        <span className='right-line'></span>

        <Link to="/cart" className='cartNav-container flexCenter'><BiCartAlt size={30}/>{cartCount}</Link>
      
      </div>

  
        <div className='flexCenter'>
          <div><CgProfile size={20}/></div>
          <div>{name}</div>
          <span className='right-line'></span>

          <Link className='logout' onClick={handleLogout}>Logout</Link>
        </div>
        </>
      ) :
        (
        <div className='flexCenter'>
          <Link to="/login" className='login'>Login</Link>
          <span className='right-line'></span>
          <Link to="/signup" className='signup'>Signup</Link>
        </div>
      )}
      </div>
  );
}

export default Navbar;
