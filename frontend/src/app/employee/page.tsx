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
      : 'http://localhost:3003/auth/create-employee';

    const method = editingId ? 'PUT' : 'POST';

    const payload = {
      employeeName: formData.employeeName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      ...(formData.password && { password: formData.password }),
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
      router.push('/home');
    }
  };

  const designationOptions = ['admin', 'manager', 'designer', 'developer'];

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>{editingId ? 'Edit Employee' : 'Create Employee'}</h2>

        {[
          { label: 'Employee Name', name: 'employeeName', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone', name: 'phone', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name} style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        ))}

        {/* Department */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Designation */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select designation</option>
            {designationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Password */}
        {!editingId && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        )}

        <button type="submit" style={styles.button}>
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #f0f4f8, #d9e2ec)',
    padding: '2rem',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '1rem',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
};
