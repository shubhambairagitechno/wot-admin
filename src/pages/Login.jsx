import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back to the dashboard!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/dashboard')
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: result.message || 'Login failed. Please try again.'
      })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="login-30 tab-box">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-12">
            <div className="form-section mt-3 rounded">
              <div className="login-inner-form">
                <div className="details">
                  {/* Logo */}
                  <div className="text-center">
                    <img src="/assets/img/logo.png" className="img-fluid" style={{ maxWidth: '200px' }} alt="Logo" />
                  </div>

                  <h5 className="mb-4">Login to access to your dashboard</h5>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="first_field" className="form-label float-start">Email address</label>
                      <input 
                        name="email" 
                        type="email" 
                        className="form-control" 
                        id="first_field" 
                        placeholder="Email Address" 
                        aria-label="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="second_field" className="form-label float-start">Password</label>
                      <input 
                        name="password" 
                        type="password" 
                        className="form-control" 
                        autoComplete="off" 
                        id="second_field" 
                        placeholder="Password" 
                        aria-label="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="checkbox form-group clearfix">
                      <div className="form-check float-start">
                        <input className="form-check-input" type="checkbox" id="rememberme" />
                        <label className="form-check-label" htmlFor="rememberme">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="form-group clearfix">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-100"
                        disabled={isLoading}
                      >
                        <span>{isLoading ? 'Logging in...' : 'Login'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
