import React from 'react'
export default function UserRegister() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px' }}>
      <div className="card">
        <div className="card-body">
            User Register
            </div>
            <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label"></label>
    <input placeholder="Email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
  </div>
  <div class="mb-3">
    <label for="exampleInputUsername" class="form-label"></label>
    <input placeholder="Username" type="text" class="form-control" id="exampleInputUsername" aria-describedby="userHelp"/>
    
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label"></label>
    <input placeholder="password" type="password" class="form-control" id="exampleInputPassword1"/>
  </div>
  
  <button type="submit" class="btn btn-primary">Login</button>
</form>
        </div>
    </div>
   
  )
}
