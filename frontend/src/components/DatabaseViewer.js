import React, { useState, useEffect } from 'react';
import './DatabaseViewer.css';

const DatabaseViewer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="database-viewer loading">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="database-viewer error">
        <h2>Error Loading Database</h2>
        <p>{error}</p>
        <button onClick={fetchUsers}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="database-viewer">
      <h2>Database Users</h2>
      {users.length === 0 ? (
        <p>No users found in the database.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>UID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.uid}</td>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.phone_number}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="refresh-btn" onClick={fetchUsers}>
        Refresh Data
      </button>
    </div>
  );
};

export default DatabaseViewer;