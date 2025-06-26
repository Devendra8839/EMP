'use client';

import { useState, useEffect } from 'react';

export default function SignUpForm({ mode, employeeData }: { mode: 'create' | 'edit'; employeeData?: any }) {
  const [employeeName, setEmployeeName] = useState(employeeData?.employeeName || '');
  const [email, setEmail] = useState(employeeData?.email || '');
  const [phone, setPhone] = useState(employeeData?.phone || '');
  const [designation, setDesignation] = useState(employeeData?.designation || '');
  const [department, setDepartment] = useState(employeeData?.department || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { employeeName, email, phone, designation, department };

    const url = mode === 'edit'
      ? `http://localhost:3001/auth/employees/${employeeData.id}`
      : 'http://localhost:3001/auth/employees';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message || 'Success');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
      <input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" required />
      <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" required />
      <button type="submit">{mode === 'edit' ? 'Update Employee' : 'Create Employee'}</button>
    </form>
  );
}
