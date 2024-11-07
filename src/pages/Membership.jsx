import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaUserEdit } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Importing toast from sonner
import { IoReturnUpBack } from "react-icons/io5";

const MembershipPage = () => {
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [duration, setDuration] = useState(1); // default to 1 month
  const [extendedMonths, setExtendedMonths] = useState(1);
  const [newMembership, setNewMembership] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Get token and role from localStorage
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Assuming 'role' stored in localStorage

  useEffect(() => {
    if (role !== '1') {  // Role '0' assumed to be Admin
      navigate('/login');
    } else {
      fetchUsers();
      fetchActiveMemberships();
    }
  }, [role, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          Role: role,  // Adding role to the headers
        },
      });
      setUsers(response.data );
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Error fetching users'); // Show error toast
    }
  };

  const fetchActiveMemberships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/memberships/active', {
        headers: {
          Authorization: `Bearer ${token}`,
          Role: role,  // Adding role to the headers
        },
      });
      setMemberships(response.data);
    } catch (err) {
      console.error('Error fetching active memberships:', err);
      toast.error('Error fetching active memberships'); // Show error toast
    }
  };

  const handleAssignMembership = async () => {
    if (!selectedUser || !duration) {
      toast.error('Please select a user and a duration.'); // Show error toast
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/memberships/assign',
        { userId: selectedUser._id, durationInMonths: duration },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,  // Adding role to the headers
          },
        }
      );
      toast.success('Membership assigned successfully'); // Show success toast
      fetchActiveMemberships();
      setError('');
      setNewMembership(false);
    } catch (err) {
      toast.error('Error assigning membership'); // Show error toast
      console.error('Error assigning membership:', err);
    }
  };

  const handleCancelMembership = async (membershipId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/memberships/cancel',
        { userId: membershipId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,  // Adding role to the headers
          },
        }
      );
      toast.success('Membership canceled successfully'); // Show success toast
      fetchActiveMemberships();
      setError('');
    } catch (err) {
      toast.error('Error canceling membership'); // Show error toast
      console.error('Error canceling membership:', err);
    }
  };

  const handleExtendMembership = async (membershipId) => {
    if (!extendedMonths) {
      toast.error('Please select a number of months to extend.'); // Show error toast
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/memberships/extend',
        { userId: membershipId, additionalMonths: extendedMonths },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,  // Adding role to the headers
          },
        }
      );
      toast.success('Membership extended successfully'); // Show success toast
      fetchActiveMemberships();
      setError('');
    } catch (err) {
      toast.error('Error extending membership'); // Show error toast
      console.error('Error extending membership:', err);
    }
  };

  // Helper function to format dates as dd/mm/yy
  const formatDate = (date) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options); 
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
    <Link to="/dashboard">
    <div className='flex m-8 justify-end gap-4 font-bold underline'>
    <IoReturnUpBack className=' text-2xl' />
    <h3>Return to Admin Dashboard</h3>
    
    </div>
    </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Membership Management</h1>

      {/* Assign Membership Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Assign Membership</h2>
        <div className="flex mb-4">
          <select
            className="flex-1 border border-gray-300 p-2 rounded-l"
            value={selectedUser ? selectedUser._id : ''}
            onChange={(e) => {
              const user = users.find((user) => user._id === e.target.value);
              setSelectedUser(user);
            }}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border border-gray-300 p-2"
            placeholder="Duration (months)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button
            onClick={handleAssignMembership}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            <FaPlus /> Assign Membership
          </button>
        </div>
      </section>

      {/* Active Memberships Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Active Memberships</h2>
        <ul className="space-y-4">
          {memberships.map((membership) => (
            <li key={membership._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{membership.user.username}</h3>
                  <p>Start Date: {formatDate(membership.startDate)}</p>
                  <p>End Date: {formatDate(membership.endDate)}</p>
                  <p>Duration: {membership.durationInMonths} months</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleCancelMembership(membership.user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-r hover:bg-red-600 mr-2"
                  >
                    <FaTrash /> Cancel
                  </button>
                  <input
                    type="number"
                    placeholder="Extend (months)"
                    className="border border-gray-300 p-2"
                    value={extendedMonths}
                    onChange={(e) => setExtendedMonths(e.target.value)}
                  />
                  <button
                    onClick={() => handleExtendMembership(membership.user._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-r hover:bg-yellow-600 ml-2"
                  >
                    <FaUserEdit /> Extend
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MembershipPage;
