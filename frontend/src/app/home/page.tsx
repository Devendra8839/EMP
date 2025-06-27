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
  const [selectedStatus, setSelectedStatus] = useState<string>('');
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
      setEmployees([]);
      const res = await fetch('http://localhost:3001/auth/employees');
      const data = await res.json();
      const employeeArray = Array.isArray(data) ? data : data.employees;

      const uniqueEmployees = Array.from(
        new Map(employeeArray.map((emp) => [emp.id, emp])).values()
      );

      setEmployees(uniqueEmployees);
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

  const handleLogout = () => {
    localStorage.removeItem('employee');
    router.push('/');
  };

  const markEmployeeLeave = async (id: string) => {
    try {
      const res = await fetch('http://localhost:3001/auth/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: id,
          status: 'LEAVE',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark leave');
      alert('Leave marked successfully');
      fetchEmployees();
    } catch (error: any) {
      alert(error.message || 'Error marking leave');
    }
  };

  const designations = Array.from(new Set(employees.map((emp) => emp.designation)));

  const filteredEmployees = filter
    ? employees.filter(emp =>
        isAdmin
          ? emp.designation === filter
          : emp.id === employee?.id && emp.designation === filter
      )
    : employees.filter(emp => (isAdmin ? true : emp.id === employee?.id));

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      alert('Please select an attendance status.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.id,
          status: selectedStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark attendance');

      alert('Attendance marked successfully');

      // ✅ Refresh full list if admin, or just the current employee
      if (isAdmin) {
        fetchEmployees(); // just in case admin marks for themselves
      } else {
        // Update the employee object locally
        const updated = { ...employee, attendanceStatus: selectedStatus };
        setEmployee(updated);

        // Also update employees array (in case it's used anywhere)
        setEmployees(prev => prev.map(emp =>
          emp.id === updated.id ? updated : emp
        ));

        // ✅ If admin needs to see the change too, refresh
        fetchEmployees();
      }
    } catch (error: any) {
      alert(error.message || 'Error marking attendance');
    }
  };

  const handleMarkAttendance = async () => {
    await markAttendance();     // your API call
    await fetchEmployeeData();  // this should reload employee info including updated status
  };
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return { backgroundColor: '#c6f6d5', color: '#22543d' };
      case 'ABSENT':
        return { backgroundColor: '#fed7d7', color: '#742a2a' };
      case 'LEAVE':
        return { backgroundColor: '#bee3f8', color: '#2a4365' };
      default:
        return { backgroundColor: '#e2e8f0', color: '#2d3748' };
    }
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.nav}>
        <div>
          <div style={styles.greeting}>
            Welcome, {employee?.employeeName && toTitleCase(employee.employeeName)} — {employee?.designation}
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
        <h2 style={styles.heading}>{isAdmin ? 'All Employees' : 'Your Details'}</h2>

        {isAdmin && (
          <div style={styles.filterContainer}>
            <label>
              Filter by Designation:{' '}
              <select onChange={(e) => setFilter(e.target.value)} value={filter} style={styles.select}>
                <option value="">All</option>
                {designations.map((dsgn) => (
                  <option key={dsgn} value={dsgn}>
                    {dsgn}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Status</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.id} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{emp.employeeName}</td>
                <td style={styles.td}>{emp.email}</td>
                <td style={styles.td}>{emp.phone}</td>
                <td style={styles.td}>{emp.department?.departmentName || 'N/A'}</td>
                <td style={styles.td}>{emp.designation}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusBadge, ...getStatusColor(emp.attendanceStatus) }}>
                    {emp.attendanceStatus || 'Not Marked'}
                  </span>
                </td>
                {isAdmin && (
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
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
                    {emp.attendanceStatus !== 'PRESENT' && (
                      <button
                        style={styles.leaveButton}
                        onClick={() => markEmployeeLeave(emp.id)}
                      >
                        Mark Leave
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!isAdmin && (
          <div style={styles.attendanceSection}>
            <h3>Mark Attendance</h3>
            {employee?.attendanceStatus ? (
              <p style={{ fontWeight: 'bold', color: 'green' }}>
                You have marked attendance as: {employee.attendanceStatus}
              </p>
            ) : (
              <form onSubmit={handleAttendanceSubmit}>
                <div style={styles.radioGroup}>
                  {['PRESENT', 'ABSENT', 'LEAVE'].map((status) => (
                    <label key={status} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      />{' '}
                      {status}
                    </label>
                  ))}
                </div>
                <button type="submit" style={styles.button}>
                  Submit Attendance
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#1a202c',
    color: '#fff',
    flexWrap: 'wrap',
  },
  greeting: {
    fontSize: '18px',
    fontWeight: 500,
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
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  heading: {
    marginBottom: '20px',
  },
  filterContainer: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  select: {
    padding: '6px',
    borderRadius: '6px',
    marginLeft: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#2d3748',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
  },
  evenRow: {
    backgroundColor: '#f7fafc',
  },
  oddRow: {
    backgroundColor: '#edf2f7',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px',
    marginTop: '10px',
  },
  editButton: {
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    marginRight: '8px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  attendanceSection: {
    marginTop: '40px',
    textAlign: 'left',
  },
  radioGroup: {
    margin: '10px 0',
  },
  radioLabel: {
    marginRight: '20px',
    fontWeight: 500,
  },
  leaveButton: {
    padding: '6px 10px',
    backgroundColor: '#805ad5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '6px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
};
