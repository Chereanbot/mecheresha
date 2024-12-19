"use client";

import { useState } from 'react';
import Link from 'next/link';
import MatrixBackground from './MatrixBackground';
import { showToast, hideToast } from '@/utils/toast';

interface LoginForm {
  identifier: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      showToast('Please provide both username/email/phone and password', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const loadingToast = showToast('Authenticating...', 'loading');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.identifier.trim(),
          password: formData.password.trim()
        }),
        credentials: 'include'
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }

      console.log('Server response:', data);

      hideToast(loadingToast);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Authentication failed');
      }

      showToast(data.message || 'Login successful!', 'success');

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
      }

      // Redirect based on the URL provided by the server
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/client/dashboard';
      }, 1000);

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Failed to login. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error', { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <MatrixBackground />
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Welcome Back</h2>
          <p className="text-secondary">
            Please login to your account
          </p>

          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Email or Phone"
              value={formData.identifier}
              onChange={(e) => setFormData({
                ...formData,
                identifier: e.target.value
              })}
            />
            <div className="input-highlight"></div>
          </div>

          <div className="form-group">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
            />
            <div className="input-highlight"></div>
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="form-actions">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="auth-link">
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 