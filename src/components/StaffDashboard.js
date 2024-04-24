import React from 'react';

function StaffDashboard() {

  const handleClick = () => {
    window.location.href = '/staffdashboard'; // Navigate to '/otherpage'
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '48px' }}>
      <h1>STAFF DASHBOARD</h1>
      <button onClick={handleClick}>
      Log Out
    </button>
    </div>
  );
}

export default StaffDashboard;
