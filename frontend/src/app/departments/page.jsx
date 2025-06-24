"use client";
import React, { useEffect, useState } from "react";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState({ Name: "" });

  const [editDepartment, setEditDepartment] = useState(null); // store department being edited

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3003/department");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3003/department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: newDepartment.Name }),
      });

      if (!response.ok) {
        console.error("Error creating department:", await response.json());
        return;
      }

      setNewDepartment({ Name: "" });
      await fetchDepartments();
    } catch (error) {
      console.error("Error in handleCreate:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3003/department/${id}`, { method: "DELETE" });
      setDepartments((prev) => prev.filter((d) => d.DepartmentID !== id));
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const handleEdit = (d) => {
    setEditDepartment({ ...d }); // copy full object for editing
  };

  const handleEditChange = (e) => {
    setEditDepartment({ ...editDepartment, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3003/department/${editDepartment.DepartmentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: editDepartment.Name }),
      });
      setEditDepartment(null); // close edit mode
      await fetchDepartments();
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {departments.map((d) => (
            <li key={d.DepartmentID} className="flex items-center gap-2 border-b pb-2">
              {editDepartment && editDepartment.DepartmentID === d.DepartmentID ? (
                <>
                  <input
                    value={editDepartment.Name}
                    name="Name"
                    onChange={handleEditChange}
                    className="border p-1 flex-1"
                  />
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditDepartment(null)} className="bg-gray-500 text-white px-2 py-1 rounded">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{d.Name}</span>
                  <button onClick={() => handleEdit(d)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(d.DepartmentID)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 font-bold">Create new department</h2>
      <form onSubmit={handleCreate} className="flex gap-2 mt-2">
        <input
          type="text"
          value={newDepartment.Name}
          onChange={(e) => setNewDepartment({ Name: e.target.value })}
          placeholder="Department Name"
          className="border p-1 flex-1"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
