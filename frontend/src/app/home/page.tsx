'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './home.css';

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
    <div className='wrapper' >
      <nav>
        <div>
          <div className='greeting' >
            Welcome, {employee?.employeeName && toTitleCase(employee.employeeName)} — {employee?.designation}
          </div>
          <button onClick={handleLogout} className='logoutStyle' >
            Logout
          </button>
        </div>
        {isAdmin && (
          <div>
            <button className='button'  onClick={() => router.push('/department/')}>
              Create Department
            </button>
            <button className='button'  onClick={() => router.push('/signup/')}>
              Create Employee
            </button>
            <button className='button'  onClick={() => alert('Go to Projects')}>
              Projects
            </button>
            <button className='button'  onClick={() => alert('Go to Attendance')}>
              Attendance
            </button>
          </div>
        )}
      </nav>

      <main className='main' >
        <h2 className='heading' >{isAdmin ? 'All Employees' : 'Your Details'}</h2>

        {isAdmin && (
          <div className='filterContainer' >
            <label>
              Filter by Designation:{' '}
              <select onChange={(e) => setFilter(e.target.value)} value={filter} className='select' >
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

        <table className='table' >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.id} className={idx % 2 === 0 ? 'evenRow' : 'oddRow'}>
                <td>{emp.employeeName}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department?.departmentName || 'N/A'}</td>
                <td>{emp.designation}</td>
                <td>
                  <span className={{ ...'statusBadge', ...getStatusColor(emp.attendanceStatus) }}>
                    {emp.attendanceStatus || 'Not Marked'}
                  </span>
                </td>
                {isAdmin && (
                  <td className='td' >
                    <button
                      className='editButton' 
                      onClick={() => {
                        localStorage.setItem('editEmployee', JSON.stringify(emp));
                        router.push('/signup');
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className='deleteButton' 
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                    {emp.attendanceStatus !== 'PRESENT' && (
                      <button
                        className='leaveButton' 
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
          <div className='attendanceSection' >
            <h3>Mark Attendance</h3>
            {employee?.attendanceStatus ? (
              <p style={{ fontWeight: 'bold', color: 'green' }}>
                You have marked attendance as: {employee.attendanceStatus}
              </p>
            ) : (
              <form onSubmit={handleAttendanceSubmit}>
                <div className='radioGroup' >
                  {['PRESENT', 'ABSENT', 'LEAVE'].map((status) => (
                    <label key={status} className='radioLabel' >
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
                <button type="submit" className='button' >
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
