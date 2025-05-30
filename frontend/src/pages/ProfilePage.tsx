import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      
      <div className="card">
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <label className="form-label">Name</label>
              <div className="mt-1 text-sm text-gray-900">{user?.name}</div>
            </div>
            
            <div>
              <label className="form-label">Email</label>
              <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
            </div>
            
            <div>
              <label className="form-label">Member Since</label>
              <div className="mt-1 text-sm text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 