'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const editData = localStorage.getItem('editEmployee');
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData(parsed);
      setEditingId(parsed.id);
      localStorage.removeItem('editEmployee');
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:3001/auth/employees/${editingId}`
      : 'http://localhost:3001/auth/signup';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Success');
        router.push('/');
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Submit error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>{editingId ? 'Edit Employee' : 'Create Employee'}</h2>

      {['employeeName', 'email', 'phone', 'department', 'designation', 'password'].map((field) => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required={field !== 'password' || !editingId}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
      ))}

      <button type="submit" style={{ padding: '10px 20px' }}>
        {editingId ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
