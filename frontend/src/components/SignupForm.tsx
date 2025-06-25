'use client';

import { useState, useEffect } from 'react';

interface SignupFormProps {
  submitUrl?: string;
  title?: string;
  buttonLabel?: string;
}

export default function SignupForm({
  submitUrl = 'http://localhost:3001/auth/signup',
  title = 'Sign Up',
  buttonLabel = 'Sign Up',
}: SignupFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    password: '',
    phone: '',
  });

  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/auth/departments')
      .then((res) => res.json())
      .then((data) => {
        const names = data.map((d: { departmentName: string }) => d.departmentName);
        setDepartments(names);
      })
      .catch((err) => console.error('Failed to fetch departments', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message || JSON.stringify(data));
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Submission failed. Check console for details.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: 'white' }}>{title}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {['name', 'email', 'phone'].map((field) => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            placeholder={capitalize(field)}
            required
            value={form[field as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            style={styles.input}
          />
        ))}

        {/* Department Dropdown */}
        <select
          required
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          style={styles.input}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Designation input */}
        <input
          type="text"
          placeholder="Designation"
          required
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          style={styles.input}
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>{buttonLabel}</button>
      </form>
    </div>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = {
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
};
