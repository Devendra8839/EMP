'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Login failed');
        return;
      }

      const data = await res.json();
      alert(data.message);
      localStorage.setItem('employee', JSON.stringify(data.employee));
      router.push('/home');
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Employee Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0d1117',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    borderRadius: '16px',
    backgroundColor: '#161b22',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  heading: {
    marginBottom: '24px',
    color: '#f0f6fc',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontSize: '14px',
    color: '#c9d1d9',
    fontWeight: 500,
  },
  input: {
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #30363d',
    backgroundColor: '#0d1117',
    color: '#f0f6fc',
    fontSize: '15px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
};
