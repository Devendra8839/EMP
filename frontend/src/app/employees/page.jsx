"use client";
import { useEffect, useState } from "react";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Designation: "",
    DepartmentID: "",
  });
  const [editEmployee, setEditEmployee] = useState(null); // store employee being edited

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3003/employee");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...newEmployee,
        DepartmentID: Number(newEmployee.DepartmentID),
      };
      const response = await fetch("http://localhost:3003/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating employee:", errorData);
        return;
      }

      setNewEmployee({ Name: "", Email: "", Phone: "", Designation: "", DepartmentID: "" });
      await fetchEmployees();
    } catch (error) {
      console.error("Error in handleCreate:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await fetch(`http://localhost:3003/employee/${id}`, { method: "DELETE" });
      setEmployees((prev) => prev.filter((emp) => emp.EmployeeID !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (emp) => {
    setEditEmployee({ ...emp }); 
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3003/employee/${editEmployee.EmployeeID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEmployee),
      });
      setEditEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading employees...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      {/* Create Employee Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2 border p-4 rounded">
        <h2 className="text-lg font-semibold">Create Employee</h2>
        <input
          className="border p-1 w-full"
          placeholder="Name"
          value={newEmployee.Name}
          onChange={(e) => setNewEmployee({ ...newEmployee, Name: e.target.value })}
          required
        />
        <input
          className="border p-1 w-full"
          placeholder="Email"
          value={newEmployee.Email}
          onChange={(e) => setNewEmployee({ ...newEmployee, Email: e.target.value })}
          required
        />
        <input
          className="border p-1 w-full"
          placeholder="Phone"
          value={newEmployee.Phone}
          onChange={(e) => setNewEmployee({ ...newEmployee, Phone: e.target.value })}
        />
        <input
          className="border p-1 w-full"
          placeholder="Designation"
          value={newEmployee.Designation}
          onChange={(e) => setNewEmployee({ ...newEmployee, Designation: e.target.value })}
          required
        />
        <input
          className="border p-1 w-full"
          type="number"
          placeholder="DepartmentID"
          value={newEmployee.DepartmentID}
          onChange={(e) => setNewEmployee({ ...newEmployee, DepartmentID: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded">Create</button>
      </form>

      <table className="min-w-full border border-gray-200">
        <thead>
          <tr>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Designation</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EmployeeID}>
              {editEmployee && editEmployee.EmployeeID === emp.EmployeeID ? (
                <>
                  <td className="p-2 border-b">{emp.EmployeeID}</td>
                  <td className="p-2 border-b">
                    <input
                      value={editEmployee.Name}
                      name="Name"
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      value={editEmployee.Email}
                      name="Email"
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <input
                      value={editEmployee.Designation}
                      name="Designation"
                      onChange={handleEditChange}
                      className="border p-1 w-full"
                    />
                  </td>
                  <td className="p-2 border-b">
                    <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 mr-2">
                      Save
                    </button>
                    <button onClick={() => setEditEmployee(null)} className="bg-gray-500 text-white px-2 py-1">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border-b">{emp.Name}</td>
                  <td className="p-2 border-b">{emp.Email}</td>
                  <td className="p-2 border-b">{emp.Designation}</td>
                  <td className="p-2 border-b">
                    <button onClick={() => handleEdit(emp)} className="bg-blue-500 text-white px-2 py-1 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(emp.EmployeeID)} className="bg-red-500 text-white px-2 py-1">
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
