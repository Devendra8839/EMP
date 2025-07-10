'use client';
import { useState, useEffect } from 'react';

export default function CreateProjectPage() {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        managerId: '',
    });
    const [managers, setManagers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch all employees to select manager
        fetch('http://localhost:3003/auth/employees')
            .then(res => res.json())
            .then(data => {
                const managerList = Array.isArray(data)
                    ? data.filter(emp => emp.Designation?.toLowerCase() === 'manager')
                    : [];
                setManagers(managerList);
            })
            .catch(err => console.error('Error fetching managers:', err));
    }, []);

    const handleChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3003/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    managerId: parseInt(formData.managerId),
                }),
            });

            const data = await res.json();
            setMessage(data.message || 'Project created!');
        } catch (error) {
            console.error('Failed to create project:', error);
            setMessage('Error creating project');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Create Project</h2>

                <div style={styles.inputGroup}>
                    <label>Project Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        required
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Project Manager</label>
                    <select
                        name="managerId"
                        required
                        value={formData.managerId}
                        onChange={handleChange}
                    >
                        <option value="">Select Manager</option>
                        {managers.map((mgr: any) => (
                            <option key={mgr.EmployeeID} value={mgr.EmployeeID}>
                                {mgr.Name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" style={styles.button}>Create</button>

                {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
            </form>
        </div>
    );
}

const styles: any = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f4f8',
    },
    form: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.5rem',
        fontWeight: 600,
    },
    inputGroup: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};
