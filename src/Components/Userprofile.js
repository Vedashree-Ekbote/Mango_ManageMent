// UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { username } = useParams();
  console.log('Username:', username);
  const [userDetails, setUserDetails] = useState({});

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

  return (
    <div>
      <h1>User Details</h1>
      {userDetails ? (
        <div>
          <p>User ID:{userDetails.user_id}</p>
          <p>Username: {userDetails.username}</p>
          <p>Email: {userDetails.email}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserProfile;
