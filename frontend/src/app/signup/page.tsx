'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
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
      setFormData({
        employeeName: parsed.employeeName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        department: parsed.department || '',
        designation: parsed.designation || '',
        password: '',
      });
      setEditingId(parsed.id);
      localStorage.removeItem('editEmployee');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:3001/auth/employees/${editingId}`
      : 'http://localhost:3001/auth/signup';

    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    alert(data.message || (editingId ? 'Employee updated' : 'Employee created'));

    if (!editingId) {
      setFormData({
        employeeName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        password: '',
      });
    } else {
      router.push('/');
    }
  };

  const designationOptions = ['admin', 'manager', 'qa', 'developer'];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: '600' }}>
          {editingId ? 'Edit Employee' : 'Create Employee'}
        </h2>

        {['employeeName', 'email', 'phone', 'department', 'password'].map((field) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required={field !== 'password' || !editingId}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Designation:
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          >
            <option value="">Select designation</option>
            {designationOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
