// app/department/page.tsx
'use client';

import { useState } from 'react';
import { CSSProperties } from 'react';

export default function DepartmentPage() {
  const [departmentName, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/auth/create-department', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departmentName }),
    });

    const data = await res.json();
    alert(data.message || 'Department created');
    setName('');
  };

  return (
    <div style={styles.container}>
      <h2>Create Department</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Department Name</label>
        <input
          type='text'
          value={departmentName}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <button type='submit' style={styles.button}>Submit</button>
      </form>
    </div>
  );
}

const styles: {
  container: CSSProperties;
  form: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '20px',
    backgroundColor: 'black',
    borderRadius: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    color: 'white',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
