'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const isAdmin = employee?.designation?.toLowerCase() === 'admin';

  useEffect(() => {
    const stored = localStorage.getItem('employee');
    if (stored) {
      const emp = JSON.parse(stored);
      setEmployee(emp);

      if (emp.designation?.toLowerCase() === 'admin') {
        fetchEmployees();
      } else {
        setEmployees([emp]);
      }
    } else {
      router.push('/login');
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/employees');
      const data = await res.json();
      const employeeArray = Array.isArray(data) ? data : data.employees;
      setEmployees(employeeArray || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`http://localhost:3001/auth/employees/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message || 'Deleted');
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (error) {
      alert('Failed to delete employee.');
    }
  };

  const handleEdit = (emp: any) => {
    localStorage.setItem('editEmployee', JSON.stringify(emp));
    router.push('/signup?mode=edit');
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    router.push('/');
  };

  const designations = Array.from(new Set(employees.map((emp) => emp.designation)));

  const filteredEmployees = filter
    ? employees.filter(emp =>
        isAdmin
          ? emp.designation === filter
          : emp.id === employee?.id && emp.designation === filter
      )
    : employees.filter(emp => (isAdmin ? true : emp.id === employee?.id));

  return (
    <div>
      <nav style={styles.nav}>
        <div>
          <div>
            Welcome, {employee?.name && toTitleCase(employee.name)} - {employee?.designation}
          </div>
          <button onClick={handleLogout} style={styles.logoutStyle}>
            Logout
          </button>
        </div>
        {isAdmin && (
          <div>
            <button style={styles.button} onClick={() => router.push('/department/')}>
              Create Department
            </button>
            <button style={styles.button} onClick={() => router.push('/signup/')}>
              Create Employee
            </button>
            <button style={styles.button} onClick={() => alert('Go to Projects')}>
              Projects
            </button>
            <button style={styles.button} onClick={() => alert('Go to Attendance')}>
              Attendance
            </button>
          </div>
        )}
      </nav>

      <main style={styles.main}>
        <h2>{isAdmin ? 'All Employees' : 'Your Details'}</h2>

        {isAdmin && (
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
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Designation</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
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
                  {isAdmin && (
                    <>
                      <button
                        style={{ ...styles.deleteButton, backgroundColor: '#0070f3', marginRight: 8 }}
                        onClick={() => {
                          localStorage.setItem('editEmployee', JSON.stringify(emp));
                          router.push('/signup');
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
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
    alignItems: 'flex-start',
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
  logoutStyle: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#e00',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
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
    marginLeft: '5px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#ffa500',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
