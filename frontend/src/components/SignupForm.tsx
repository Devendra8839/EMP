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

  const [departments, setDepartments] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch departments and check for edit data
  useEffect(() => {
    fetch('http://localhost:3003/auth/departments')
      .then((res) => res.json())
      .then((data) => {
        const departmentNames = data.map((d: { Name: string }) => d.Name);
        setDepartments(departmentNames);
      })
      .catch((err) => console.error('Error loading departments:', err));

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
      ? `http://localhost:3003/auth/employees/${editingId}`
      : 'http://localhost:3003/auth/signup';

    const method = editingId ? 'PUT' : 'POST';

    const payload = {
      employeeName: formData.employeeName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      ...(formData.password && { password: formData.password }), // only if password present
    };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

  const designationOptions = ['admin', 'manager', 'designer', 'developer'];

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
          {editingId ? 'Edit Employee' : 'Sign Up Employee'}
        </h2>

        {/* Employee Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Department Dropdown */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Department:</label>
          <select
            name="department"
            value={formData.department}
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
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Dropdown */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Designation:</label>
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

        {/* Password (only for create) */}
        {!editingId && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
          </div>
        )}

        <button
          type="submit"
          onClick={() => router.push('/login')}
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
          {editingId ? 'Update' : 'Signup'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/login')}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#e5e7eb',
            color: '#111827',
            fontSize: '1rem',
            fontWeight: '500',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
