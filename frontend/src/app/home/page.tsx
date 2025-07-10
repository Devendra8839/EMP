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
  const [editingEmp, setEditingEmp] = useState<any | null>(null);
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
      const res = await fetch('http://localhost:3003/auth/employees');
      const data = await res.json();
      const employeeArray = Array.isArray(data) ? data : data.employees;
      setEmployees(employeeArray || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`http://localhost:3003/auth/employees/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message || 'Deleted');
      setEmployees((prev) => prev.filter((emp) => emp.EmployeeID !== id));
    } catch (error) {
      alert('Failed to delete employee.');
    }
  };

  const handleEdit = (emp: any) => {
    setEditingEmp({
      ...emp,
      employeeName: emp.Name,
      email: emp.Email,
      phone: emp.Phone,
      designation: emp.Designation,
      department: emp.Department?.Name,
    });
  };

  const handleEditChange = (e: any) => {
    setEditingEmp({ ...editingEmp, [e.target.name]: e.target.value });
  };
  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3003/auth/employees/${editingEmp.EmployeeID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeName: editingEmp.employeeName,
        email: editingEmp.email,
        phone: editingEmp.phone,
        designation: editingEmp.designation,
        department: editingEmp.Department?.Name,
      }),
    });

    const data = await res.json();
    alert(data.message || 'Employee updated');
    setEditingEmp(null);
    fetchEmployees();
  };

  const handleLogout = () => {
    localStorage.removeItem('employee');
    router.push('/');
  };

  const filteredEmployees = filter
    ? employees.filter((emp) =>
      isAdmin
        ? emp.Department?.Name === filter
        : emp.EmployeeID === employee?.EmployeeID && emp.Department?.Name === filter
    )
    : employees.filter((emp) => (isAdmin ? true : emp.EmployeeID === employee?.EmployeeID));

  

  const [projectData, setProjectData] = useState<any[]>([]);
 
  useEffect(() => {
    if (employee?.designation?.toLowerCase() === 'admin') {
      fetch('http://localhost:3003/project/manager-projects')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProjectData(data);
          } else {
            console.error('Invalid project data:', data);
            setProjectData([]); // fallback to empty array
          }
        })
        .catch(error => {
          console.error('Failed to fetch projectData:', error);
          setProjectData([]); // on error fallback
        });
    }
  }, [employee]);


  

  return (
    <div>
      <nav style={styles.nav}>
        <div>
          <div>
            Welcome, {employee?.Name && toTitleCase(employee.Name)} - {employee?.Designation}
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
            <button style={styles.button} onClick={() => router.push('/employee/')}>
              Create Employee
            </button>
            <button style={styles.button} onClick={() => router.push('/create-project/')}>
              Create project
            </button>
          </div>
        )}
      </nav>

      <main style={styles.main}>
        <h2>{isAdmin ? 'All Employees' : 'Your Details'}</h2>

        {isAdmin && (
          <label style={{ marginLeft: '1rem' }}>
            Filter by Department:{' '}
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="">All</option>
              {Array.from(new Set(employees.map((emp) => emp.Department?.Name)))
                .filter(Boolean)
                .map((deptName) => (
                  <option key={deptName} value={deptName}>
                    {deptName}
                  </option>
                ))}
            </select>
          </label>
        )}

        {isAdmin && (
          <div style={{ marginTop: '4rem', textAlign: 'left' }}>
            <h2>Project Assignments by Managers</h2>
            {projectData.map((manager) => (
              <div key={manager.EmployeeID} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#2563eb' }}>{manager.Name}</h3>
                {manager.managedProjects.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'gray' }}>No projects assigned</p>
                ) : (
                  <ul>
                    {manager.managedProjects.map((proj: any) => (
                      <li key={proj.ProjectID}>
                        <strong>{proj.Name}</strong> – {proj.StartDate.slice(0, 10)} to {proj.EndDate.slice(0, 10)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}


        {editingEmp && (
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3>Edit Employee</h3>
            <input
              type="text"
              name="employeeName"
              value={editingEmp.employeeName}
              onChange={handleEditChange}
              placeholder="Employee Name"
            />
            <input
              type="email"
              name="email"
              value={editingEmp.email}
              onChange={handleEditChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={editingEmp.phone}
              onChange={handleEditChange}
              placeholder="Phone"
            />
            <input
              type="text"
              name="department"
              value={editingEmp.department}
              onChange={handleEditChange}
              placeholder="Department"
            />
            <input
              type="text"
              name="designation"
              value={editingEmp.designation}
              onChange={handleEditChange}
              placeholder="Designation"
            />
            <button onClick={handleUpdate} style={{ ...styles.button, marginTop: '1rem' }}>
              Save
            </button>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Designation</th>
              <th style={styles.th}>Department</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.EmployeeID}>
                <td style={styles.td}>{emp.employeeName || emp.Name}</td>
                <td style={styles.td}>{emp.email || emp.Email}</td>
                <td style={styles.td}>{emp.Phone || emp.phone}</td>
                <td style={styles.td}>{emp.Designation || emp.designation}</td>
                <td style={styles.td}>{emp.Department?.Name || emp.department}</td>
                {isAdmin && (
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.editButton, marginRight: 8 }}
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(emp.EmployeeID)}
                    >
                      Delete
                    </button>
                  </td>
                )}
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
