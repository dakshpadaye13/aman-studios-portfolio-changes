import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from './api';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiLogin(password);
      navigate('/admin/dashboard');
    } catch {
      setError('Incorrect password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--color-bg-dark)', cursor: 'auto' }}>
      <div className="relative w-full max-w-sm p-8 rounded-2xl border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        <div className="text-center mb-8">
          <span className="text-5xl font-bold text-white block mb-2" style={{ fontFamily: "var(--font-display)" }}>AS</span>
          <span className="text-xs uppercase tracking-[0.25em] block" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-text-muted)' }}>Admin Panel</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="admin-password" className="text-[10px] uppercase tracking-[0.2em] mb-2 block" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-text-muted)' }}>Password</label>
            <input
              id="admin-password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              placeholder="Enter admin password"
              className="w-full px-4 py-3.5 rounded-lg border text-sm text-white outline-none transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", backgroundColor: '#0a0a0a', borderColor: error ? '#ef4444' : 'var(--color-border)', cursor: 'text' }}
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
            style={{ fontFamily: "var(--font-heading)", backgroundColor: 'var(--color-accent-1)', color: '#000', cursor: 'pointer' }}>
            {loading ? 'Verifying…' : 'Sign In →'}
          </button>
        </form>
        <a href="/" className="block text-center mt-6 text-xs hover:opacity-100" style={{ fontFamily: "var(--font-heading)", color: 'var(--color-text-muted)', cursor: 'pointer' }}>← Back to portfolio</a>
      </div>
    </div>
  );
};

export default AdminLogin;
