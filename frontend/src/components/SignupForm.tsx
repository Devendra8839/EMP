'use client';

import { useEffect, useState } from 'react';

export default function SignUpForm({
  mode,
  employeeData,
  onSuccess,
}: {
  mode: 'create' | 'edit';
  employeeData?: any;
  onSuccess: () => void;
}) {
  const [employeeName, setEmployeeName] = useState(employeeData?.employeeName || '');
  const [email, setEmail] = useState(employeeData?.email || '');
  const [phone, setPhone] = useState(employeeData?.phone || '');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState(employeeData?.designation || '');
  const [department, setDepartment] = useState(employeeData?.department?.id || '');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch('http://localhost:3001/auth/departments');
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    }

    fetchDepartments();
  }, []);

  const designationOptions = ['admin', 'manager', 'qa', 'developer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      employeeName,
      email,
      phone,
      designation,
      departmentId: parseInt(department),
    };

    if (mode === 'create') {
      payload.password = password;
    }

    const url =
      mode === 'edit'
        ? `http://localhost:3001/auth/employees/${employeeData.id}`
        : 'http://localhost:3001/auth/signup';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message || 'Success');

    // ✅ Clear form and navigate back
    if (res.ok && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
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
          {mode === 'edit' ? 'Edit Employee' : 'Create Employee'}
        </h2>

        {[{ label: 'Name', value: employeeName, onChange: setEmployeeName },
          { label: 'Email', value: email, onChange: setEmail },
          { label: 'Phone', value: phone, onChange: setPhone }].map((field, idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
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
        ))}

        {mode === 'create' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Designation
          </label>
          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          >
            <option value="">Select Department</option>
            {departments.map((dept: any) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
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
          {mode === 'edit' ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
