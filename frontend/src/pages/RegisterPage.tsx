import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.email || !formData.password || !formData.name || !formData.invitationCode) return;

    try {
      setLoading(true);
      clearError();
      await register(formData.email, formData.password, formData.name, formData.invitationCode);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isValid = formData.name && formData.email && formData.password && formData.invitationCode && passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 touch-manipulation"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="form-input text-base sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input text-base sm:text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input text-base sm:text-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`form-input text-base sm:text-sm ${
                  formData.confirmPassword && !passwordsMatch 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : ''
                }`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <div>
              <label htmlFor="invitationCode" className="form-label">
                Invitation Code
              </label>
              <input
                id="invitationCode"
                name="invitationCode"
                type="text"
                autoComplete="off"
                required
                className="form-input text-base sm:text-sm"
                value={formData.invitationCode}
                onChange={(e) => setFormData({...formData, invitationCode: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full text-base sm:text-sm py-3 sm:py-2"
              loading={loading}
              disabled={!isValid}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 