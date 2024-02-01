import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {


  const user = useSelector((state)=>state.user.userProfile)
  console.log(user)
  

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <p className="text-gray-600 mb-2">{`ID: ${user.userProfile._id}`}</p>
        <p className="text-gray-600 mb-2">{`Name: ${user.userProfile.name}`}</p>
        <p className="text-gray-600 mb-2">{`Email: ${user.userProfile.email}`}</p>
        <p className="text-gray-600 mb-2">{`Role: ${user.userProfile.role}`}</p>
        <p className="text-gray-600 mb-2">{`Created At: ${user.userProfile.createdAt}`}</p>
      </div>
    </div>
  );
};

export default Profile;
