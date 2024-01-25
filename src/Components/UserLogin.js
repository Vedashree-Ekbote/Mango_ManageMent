import React, { useState } from 'react';
import axios from 'axios';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';

export default function UserLogin() {
  const navigate = useNavigate();
  const [isRegistering, setRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleMode = () => {
    setRegistering((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';

    try {
      const response = await axios.post(`http://localhost:3001` + endpoint, {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        console.log(response.data.message);
        if(!isRegistering){
          const userResponse = await axios.get(`http://localhost:3001/user/${username}`);

          const user = userResponse.data.user;
         console.log(`User Details: ${user.username}, ${user.email}`);
        }
        navigate(isRegistering ? '/login' : `/user-dashboard/${username}`);

      } else {
        console.error('Action failed');
      }
    } catch (error) {
      console.error(`Error during ${isRegistering ? 'registration' : 'login'}:`, error);
    }
  };

  return (
    <div className="card-container" style={{ border: '1px solid #ccc', padding: '20px' }}>
      <div className="card">
        <div className="card-body">
          <h2>{isRegistering ? 'User Register' : 'User Login'}</h2>
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-3">
                <input
                  placeholder="Email"
                  type="email"
                  className="form-control"
                  id="exampleInputEmail"
                  name='email'
                  aria-describedby="emailHelp"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div className="mb-3">
              <input
                placeholder="Username"
                type="text"
                className="form-control"
                name='username'
                id="exampleInputUsername"
                aria-describedby="userHelp"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                placeholder="Password"
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              {isRegistering ? (
                <>
                  Already have an account?{' '}
                  <button type="button" className="btn btn-link" onClick={toggleMode}>
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't Have an Account?{' '}
                  <button type="button" className="btn btn-link" onClick={toggleMode}>
                    Register
                  </button>
                </>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
