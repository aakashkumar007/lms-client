import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaUserEdit, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IoReturnUpBack } from "react-icons/io5";

const MembershipPage = () => {
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [duration, setDuration] = useState(1);
  const [extendedMonths, setExtendedMonths] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [membershipToCancel, setMembershipToCancel] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (role !== '1') {
      navigate('/login');
    } else {
      fetchUsers();
      fetchActiveMemberships();
    }
  }, [role, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api_url}/api/auth/users1`, {
        headers: { Authorization: `Bearer ${token}`, Role: role },
      });
      // Filter users by role 0
      const role0Users = response.data.filter((user) => user.role === 0);
      setUsers(role0Users);
    } catch (err) {
      toast.error('Error fetching users');
      console.error(err);
    }
  };

  const fetchActiveMemberships = async () => {
    try {
      const response = await axios.get(`${api_url}/api/memberships/active`, {
        headers: { Authorization: `Bearer ${token}`, Role: role },
      });
      setMemberships(response.data);
    } catch (err) {
      toast.error('Error fetching active memberships');
      console.error(err);
    }
  };

  const handleAssignMembership = async () => {
    if (!selectedUser || !duration) {
      toast.error('Please select a user and a duration.');
      return;
    }

    try {
      await axios.post(
        `${api_url}/api/memberships/assign`,
        { userId: selectedUser._id, durationInMonths: duration },
        { headers: { Authorization: `Bearer ${token}`, Role: role } }
      );
      toast.success('Membership assigned successfully');
      fetchActiveMemberships();
    } catch (err) {
      toast.error('Error assigning membership');
      console.error(err);
    }
  };

  const handleConfirmCancel = (membershipId) => {
    setMembershipToCancel(membershipId);
    setShowCancelConfirm(true);
  };

  const handleCancelMembership = async () => {
    try {
      await axios.post(
        `${api_url}/api/memberships/cancel`,
        { userId: membershipToCancel },
        { headers: { Authorization: `Bearer ${token}`, Role: role } }
      );
      toast.success('Membership canceled successfully');
      fetchActiveMemberships();
      setShowCancelConfirm(false);
      setMembershipToCancel(null);
    } catch (err) {
      toast.error('Error canceling membership');
      console.error(err);
    }
  };

  const handleExtendMembership = async (membershipId) => {
    if (!extendedMonths) {
      toast.error('Please select a number of months to extend.');
      return;
    }

    try {
      await axios.post(
        `${api_url}/api/memberships/extend`,
        { userId: membershipId, additionalMonths: extendedMonths },
        { headers: { Authorization: `Bearer ${token}`, Role: role } }
      );
      toast.success('Membership extended successfully');
      fetchActiveMemberships();
    } catch (err) {
      toast.error('Error extending membership');
      console.error(err);
    }
  };

  const formatDate = (date) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  const filteredMemberships = memberships.filter((membership) =>
    membership.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Link to="/dashboard">
        <div className='flex m-8 justify-end gap-4 font-bold underline'>
          <IoReturnUpBack className='text-2xl' />
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

      {/* Search Memberships Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Search Memberships</h2>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-l-md"
            placeholder="Search by Username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
            <FaSearch />
          </button>
        </div>
      </section>

      {/* Active Memberships Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Active Memberships</h2>
        <ul className="space-y-4">
          {filteredMemberships.map((membership) => (
            <li key={membership._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{membership?.user?.username}</h3>
                  <p>Start Date: {formatDate(membership.startDate)}</p>
                  <p>End Date: {formatDate(membership.endDate)}</p>
                  <p>Duration: {membership.durationInMonths} months</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleConfirmCancel(membership?.user._id)}
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

      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to cancel this membership?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleCancelMembership}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPage;
