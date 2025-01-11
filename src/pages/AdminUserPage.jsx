import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrashAlt, FaEdit, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0);
  const [users, setUsers] = useState([]);
  const [activeMemberships, setActiveMemberships] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const api_url = import.meta.env.VITE_API_URL
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (userRole !== '1') {
    navigate('/login');
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api_url}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      toast.error('Error fetching users');
      console.error(err);
    }
  };

  const fetchActiveMemberships = async () => {
    try {
      const response = await axios.get(`${api_url}/api/memberships/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveMemberships(response.data);
    } catch (err) {
      toast.error('Error fetching active memberships');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchActiveMemberships();
  }, [token]);

  const handleRegisterUser = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.post(
        `${api_url}/api/auth/register`,
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('User created successfully!');
      setUsername('');
      setPassword('');
      setRole(0);
      fetchUsers(); // Call fetchUsers after creating the user
    } catch (err) {
      toast.error('Error creating user');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    const userHasActiveMembership = activeMemberships.some(
      (membership) => membership.user._id === userId
    );

    if (userHasActiveMembership) {
      toast.error('User cannot be deleted as they have an active membership');
      setShowDeleteConfirm(false);
      return;
    }

    try {
      await axios.delete(`${api_url}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully!');
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error('Error deleting user');
      console.error(err);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/dashboard/${userId}`);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !selectedUser.username || !selectedUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.put(
        `${api_url}/api/auth/users/${selectedUser._id}`,
        { username: selectedUser.username, password: selectedUser.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('User updated successfully!');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, username: selectedUser.username, password: selectedUser.password }
            : user
        )
      );

      setSelectedUser(null);
      setUsername('');
      setPassword('');
    } catch (err) {
      toast.error('Error updating user');
      console.error(err);
    }
  };

  const filteredUsers = users
    // .filter(user => user.role === 0)
    .filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-end underline font-bold">
        <Link to="/dashboard">Go back to Dashboard</Link>
      </div>
      <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">Manage Users</h1>

      <section className="mb-6 ">
        <h2 className="text-2xl text-center sm:text-start font-semibold mb-4">Register New User</h2>
        <div className="flex flex-col sm:flex-row mb-4 gap-2">
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

          <button onClick={handleRegisterUser} className="flex justify-center items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">
          <FaPlus /><p>Create User</p>
        </button>
        </div>
        
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-center sm:text-start mb-4">Search Users</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l-md"
            placeholder="Search by Username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
          >
            <FaSearch />
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl text-center sm:text-start font-semibold mb-4">All Users</h2>
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border mb-2 cursor-pointer">
                <div className="flex items-center space-x-4 ">
                  <span
                    onClick={() => handleUserClick(user._id)}
                    className="font-semibold cursor-pointer underline"
                  >
                    {user.username}
                  </span>
                  <span className="text-gray-500">{user.role === 0 ? 'User' : 'Admin'}</span>
                </div>

                <div className="flex space-x-4">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  />
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteConfirm(true);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </section>

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={() => handleDeleteUser(userToDelete._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Update User</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 mr-2"
              placeholder="Username"
              value={selectedUser.username}
              onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
            />
            <input
              type="password"
              className="border border-gray-300 p-2 mr-2"
              placeholder="Password"
              value={selectedUser.password}
              onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
            />
          </div>
          <button onClick={handleUpdateUser} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Update User
          </button>
        </section>
      )}
    </div>
  );
};

export default AdminUserPage;
