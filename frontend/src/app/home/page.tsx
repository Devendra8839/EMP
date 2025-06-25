'use client';

import { useEffect, useState } from 'react';

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function HomePage() {
  const [employee, setEmployee] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('employee');
    if (stored) {
      const emp = JSON.parse(stored);
      setEmployee(emp);
      fetchEmployees();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/employees');
      const data = await res.json();

      // If backend returns { employees: [...] }, extract the array
      const employeeArray = Array.isArray(data) ? data : data.employees;
      if (!Array.isArray(employeeArray)) {
        console.error('Invalid data format from backend:', data);
        return;
      }

      setEmployees(employeeArray);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/auth/employees/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      alert(data.message || 'Deleted');

      // Refresh employee list or filter out deleted one
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete employee.');
    }
  };

  const filteredEmployees = filter
    ? employees.filter((emp) => emp.designation === filter)
    : employees;

  const designations = Array.from(new Set(employees.map((emp) => emp.designation)));

  return (
    <div>
      <nav style={styles.nav}>
        <span>
          Welcome, {employee?.name && toTitleCase(employee.name)} - {employee?.designation}
        </span>
        <div>
          <button style={styles.button} onClick={() => window.location.href = '/department/'}>
            Create Department
          </button>
          <button style={styles.button} onClick={() => window.location.href = '/signup/'}>
            Create Employee
          </button>
          <button style={styles.button} onClick={() => alert('Go to Projects')}>
            Projects
          </button>
          <button style={styles.button} onClick={() => alert('Go to Attendance')}>
            Attendance
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        <h2>All Employees</h2>

        <label>
          Filter by Designation:{' '}
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="">All</option>
            {designations.map((dsgn) => (
              <option key={dsgn} value={dsgn}>
                {dsgn}
              </option>
            ))}
          </select>
        </label>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td style={styles.td}>{emp.employeeName}</td>
                <td style={styles.td}>{emp.email}</td>
                <td style={styles.td}>{emp.phone}</td>
                <td style={styles.td}>{emp.department}</td>
                <td style={styles.td}>{emp.designation}</td>
                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(emp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#222',
    color: '#fff',
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  main: {
    padding: '40px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottom: '2px solid #ccc',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    borderBottom: '1px solid #eee',
    padding: '10px',
    textAlign: 'left',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};
