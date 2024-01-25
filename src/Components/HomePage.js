import React from 'react'
import AdminLogin from './AdminLogin'
import UserLogin from './UserLogin'

import '../index.css'
export default function HomePage() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Left */}
       <div className='left' style={{ width: '50%' }}>
        <AdminLogin/>
      </div>
      <div className='right' style={{ width: '50%' }}>
        <UserLogin/>
      </div> 
     
    </div>
  )
}
