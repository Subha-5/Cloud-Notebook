import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = (props) => {

  const [credentials, setCredentials] = useState(
    {
      name: "",
      email: "",
      password: "",
      cpassword: ""
    }
  )

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password } = credentials
    const response = await fetch(
      // "http://localhost:5000/api/auth/createuser",
      process.env.SERVER + "/api/auth/createuser",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('token', json.authToken)
      navigate('/')
      props.showAlert("Account created successfully", "success")
    } else {
      props.showAlert("Invalid Credentials", "danger")
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h4 className="text-center mt-2"> Create an account to start using iNotebook </h4>
      <div className="container d-inline-flex p-4 justify-content-center">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input type="text" className="form-control" id="name" name="name" value={credentials.name} aria-describedby="name" onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Your Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={credentials.email} aria-describedby="emailHelp" onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Your Password</label>
            <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} required minLength={5} />
            <div id="name" className="form-text"style={{color: 'red'}}>{(credentials.password.length===0 && 'Enter a password') || (credentials.password.length < 5 && 'Password must be atleast 5 characters long.')}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={onChange} required minLength={5} />
            {credentials.password !== credentials.cpassword && <div id="name" className="form-text" style={{color: 'red'}}>Passwords do not match</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={credentials.password.length < 5 || credentials.password.length < 5 || credentials.password !== credentials.cpassword}>Sign up</button>
        </form>
      </div>
      <p className=" mt-5 text-center">&copy;Subha-5</p>
    </div >
  )
}

export default Signup