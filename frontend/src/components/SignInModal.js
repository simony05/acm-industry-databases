import React, { useState } from 'react';

export default function SignInModal({ port = '8080', onSignedIn }) {
  const [mode, setMode] = useState('signin'); // or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const base = `http://localhost:${port}`;

  async function submit() {
    setError('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === 'signin' ? '/api/signin' : '/api/signup';
      const res = await fetch(base + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200 || res.status === 201) {
        // Signed in (or created) — for signup we still consider the user signed in
        setLoading(false);
        // pass back the email so the parent can include it in subsequent requests
        onSignedIn(email);
        return;
      }

      const body = await res.json().catch(() => ({}));
      setError(body.error || `Request failed with status ${res.status}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '420px',
          background: '#022d35',
          padding: '1.25rem',
          borderRadius: '8px',
          color: '#E5E7EB',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</h2>
        <p style={{ marginTop: 0, color: '#9CA3AF' }}>
          {mode === 'signin'
            ? 'Sign in to access the APIs.'
            : 'Create an account to use the demo.'}
        </p>

        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />

          {error && (
            <div style={{ color: '#ffb4b4', fontSize: '0.95rem' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={submit}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '6px',
                background: '#1a1d24ff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              style={{
                padding: '0.6rem',
                borderRadius: '6px',
                background: '#e2e8f0',
                color: '#111827',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {mode === 'signin' ? 'Create account' : 'Back to sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
