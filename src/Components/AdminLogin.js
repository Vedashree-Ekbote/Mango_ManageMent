import React, { useState } from 'react';
import '../css/home.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post(`http://localhost:3001/adminlogin`,{
       email,username,password
      });
      if (response.status === 200) {
        console.log(response.data.message);
        navigate('/admin-dashboard'); // Redirect to Admin dashboard page
      } else {
        console.error('Action failed');
      }
    }catch(error){
      console.error(`Error during admin login`, error);
    }
  }
  return (
    <div className="card-container" style={{ border: '1px solid #ccc', padding: '20px' }}>
      <div className="card">
        <div className="card-body">
          <h2>Admin Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
  <div class="mb-3">
  
    <input placeholder="Email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)}/>
  </div>
  <div class="mb-3">
   
    <input placeholder="Username" type="text" class="form-control" id="exampleInputUsername" aria-describedby="userHelp"onChange={(e) => setUsername(e.target.value)}/>
    
  </div>
  <div class="mb-3">
    
    <input placeholder="password" type="password" class="form-control" id="exampleInputPassword1"onChange={(e) => setPassword(e.target.value)}/>
  </div>
  
  <button type="submit" class="btn btn-primary">Login</button>
</form>
        </div>
    </div>
    
  )
}
