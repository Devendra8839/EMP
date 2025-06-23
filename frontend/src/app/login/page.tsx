'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
  };

return (
  <div style={styles.container}>
    <h2>Login</h2>
    <form onSubmit={handleSubmit} style={styles.form}>
      <label htmlFor="email" style={styles.label}>Email</label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={styles.input}
      />

      <label htmlFor="password" style={styles.label}>Password</label>
      <input
        id="password"
        type="password"
        placeholder="Enter your password"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={styles.input}
      />

      <button type="submit" style={styles.button}>Login</button>
    </form>
  </div>
);
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    textAlign: 'center',
    backgroundColor: 'black',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #bbb',
    borderRadius: '6px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  label: {
    textAlign: 'left',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};
