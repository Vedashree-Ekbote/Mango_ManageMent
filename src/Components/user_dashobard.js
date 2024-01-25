import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodaysaleUser from './TodaysaleUser';
import Totalsaleuser from './TotalsaleUser';
import Userprofile from './Userprofile';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const {user_id}=useParams();
  const [userDetails, setUserDetails] = useState({});
  const [userId, setUserID] = useState({});
  const [selectedLink, setSelectedLink] = useState('profile');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        console.log('Fetching user details...');
        const response = await axios.get(`http://localhost:3001/user/${username}`);
        console.log('User details response:', response.data.user);
        setUserDetails(response.data.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username]);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       console.log('Fetching user details...');
  //       const response = await axios.get(`http://localhost:3001/user/${userId}`);
  //       console.log('User details response:', response.data.user);
  //       setUserID(response.data.user);
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //     }
  //   };

  //   fetchUserId();
  // }, [userId]);
  const handleOnClick = () => {
    navigate('/');
    console.log('Logging out...');
  };

  const handleNavItemClick = (link) => {
    setSelectedLink(link);
  };

  const renderContent = () => {
    switch (selectedLink) {
      case 'profile':
        return <Userprofile username={userDetails.username} />;
      case 'todaySale':
        return <TodaysaleUser/>;
      case 'totalSale':
        return <Totalsaleuser />;
      default:
        return <div>Welcome to Dashboard</div>;
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-auto col-md-2 min-vh-100 bg-dark'>
          <ul className='nav flex-column'>
            <li className='nav-item text-white fs-4'>
              <a
                className={`nav-link fs-5 ${selectedLink === 'profile' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('profile')}>
                <i className='bi bi-person-circle'></i>
                <span className='ms-2'>Profile</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
              <a
                className={`nav-link fs-5 ${selectedLink === 'todaySale' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('todaySale')}>
                <i className='bi bi-calendar-check'></i>
                <span className='ms-2'>Today's Sale</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
              <a
                className={`nav-link fs-5 ${selectedLink === 'totalSale' ? 'active' : ''}`}
                onClick={() => handleNavItemClick('totalSale')}>
                <i className='bi bi-cash-coin'></i>
                <span className='ms-2'>Total Sale</span>
              </a>
            </li>
            <li className='nav-item text-white fs-4'>
              <a className='nav-link  fs-5' aria-current='page' onClick={() => handleOnClick()}>
                <i className='bi bi-box-arrow-right'></i>
                <span className='ms-2'>Logout</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='col'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
