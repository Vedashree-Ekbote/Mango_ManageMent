import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleOnClick =()=>{
    navigate('/');
    console.log('Logging out...');
  }

  const [selectedLink, setSelectedLink]=useState('profile');

  const handleNavItemClick = (link) => {
    setSelectedLink(link);
  };

  const renderContent=()=>{
    switch(selectedLink){
      case('purchase'):
      return <div>Purchase</div>
      case 'todaySale':
        return <div>Today's Sale Content</div>
      case 'totalSale':
          return <div>Totals Sale Content</div>
    default:
    return <div>Profile Content</div>;
    }
  }
  
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-auto col-md-2 min-vh-100 bg-dark'>
          <ul className='nav flex-column'>
            <li className='nav-item text-white fs-4'>
            <a href="#" className={`nav-link fs-5 ${selectedLink === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('profile')}>
              <i className="bi bi-person-circle"></i>
                <span className='ms-2'>Profile</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
            <a href="#" className={`nav-link fs-5 ${selectedLink === 'purchase' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('purchase')}>
              <i class="bi bi-cart-check-fill"></i>
                <span className='ms-2'>Purchase</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
            <a href="#" className={`nav-link fs-5 ${selectedLink === 'todaySale' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('todaySale')}>
                <i className="bi bi-calendar-check"></i>
                <span className='ms-2'>Today's Sale</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
            <a href="#" className={`nav-link fs-5 ${selectedLink === 'totalSale' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('totalSale')}>
                <i className="bi bi-cash-coin"></i>
                <span className='ms-2'>Total Sale</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
              <a href="#" className='nav-link  fs-5' aria-current='page' onClick={() => handleOnClick()}>
                <i className="bi bi-box-arrow-right"></i>
                <span className='ms-2'>Logout</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='col'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
