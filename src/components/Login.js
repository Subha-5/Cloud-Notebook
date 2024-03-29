import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" })

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(
            // "http://localhost:5000/api/auth/login",
            "https://cloud-notebook-seven.vercel.app/api/auth/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });
        const json = await response.json();
        // console.log(json)
        if (json.success) {
            // * Save the auth token and redirect
            localStorage.setItem('token', json.authToken)
            props.showAlert("Logged in successfully", "success")
            navigate('/')

        } else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <>
            <h4 className="text-center mt-3"> Login to continue to iNotebook </h4>
            <div className="container d-inline-flex p-4 justify-content-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={onChange} value={credentials.email} aria-describedby="emailHelp" />
                        {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
                <p className=" mt-5 text-center">&copy;Subha-5</p>
        </>
    )
}

export default Login