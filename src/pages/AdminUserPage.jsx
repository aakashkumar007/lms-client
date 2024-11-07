import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Assuming Sonner is being used for toasts

const AdminUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0); // Default role to '0' (User)
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For editing user
  const navigate = useNavigate();

  // Get token and userRole from localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (userRole !== '1') { // Redirect to login if the role is not admin
    navigate('/login');
  }

  // Fetch all users on page load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        toast.error('Error fetching users');
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  // Register User API
  const handleRegisterUser = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        { username, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        }
      );

      toast.success('User created successfully!');
      setUsername('');
      setPassword('');
      setRole(0);

      // Directly add the new user to the list without fetching all users again
      setUsers((prevUsers) => [
        ...prevUsers,
        { username, password, role: role === 1 ? 'Admin' : 'User' },
      ]);
    } catch (err) {
      toast.error('Error creating user');
      console.error(err);
    }
  };

  // Delete User API
  const handleDeleteUser = async (userId) => {
    try {
      // Send DELETE request with userId in the URL params
      const response = await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('User deleted successfully!');

      // Fetch updated user list after deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toast.error('Error deleting user');
      console.error(err);
    }
  };

  // Update User Details API
  const handleUpdateUser = async () => {
    if (!selectedUser || !selectedUser.username || !selectedUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${selectedUser._id}`,
        { username: selectedUser.username, password: selectedUser.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('User updated successfully!');

      // Update the user in the state without fetching all users again
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, username: selectedUser.username, password: selectedUser.password }
            : user
        )
      );

      setSelectedUser(null); // Close the edit mode
      setUsername('');
      setPassword('');
    } catch (err) {
      toast.error('Error updating user');
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <div className='text-end underline font-bold'>
      <Link to="/dashboard">
      Go back to Dashboard
      </Link>
    </div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin: Manage Users</h1>

      {/* User Registration Form */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Register New User</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="border border-gray-300 p-2 mr-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-300 p-2 mr-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 mr-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="0">User</option>
            <option value="1">Admin</option>
          </select>
        </div>

        <button
          onClick={handleRegisterUser}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          <FaPlus /> Create User
        </button>
      </section>

      {/* Users List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border mb-2">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">{user.username}</span>
                  <span className="text-gray-500">{user.role === 0 ? 'User' : 'Admin'}</span>
                </div>

                {/* Edit and Delete Icons */}
                <div className="flex space-x-4">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  />
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteUser(user._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </section>

      {/* Update User Form */}
      {selectedUser && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Update User Details</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 mr-2"
              placeholder="Username"
              value={selectedUser.username}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, username: e.target.value })
              }
            />
            <input
              type="password"
              className="border border-gray-300 p-2 mr-2"
              placeholder="Password"
              value={selectedUser.password}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, password: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleUpdateUser}
            className="bg-yellow-500 text-white px-4 py-2 rounded-r hover:bg-yellow-600"
          >
            Update User
          </button>
        </section>
      )}
    </div>
  );
};

export default AdminUserPage;
