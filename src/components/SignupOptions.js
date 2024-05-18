import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupOptions = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '50px',
    },
    heading: {
      marginBottom: '20px',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#2ECC40',
      color: 'white',
    },
    buttonHover: {
      backgroundColor: '#28a745',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Choose Your Signup Option</h1>
      <div style={styles.buttonsContainer}>
        <button
          onClick={() => handleNavigation('/signup-admin')}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Signup as Admin
        </button>
        <button
          onClick={() => handleNavigation('/signup-staff')}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Signup as Staff
        </button>
        <button
          onClick={() => handleNavigation('/signup-shopper')}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Signup as Shopper
        </button>
      </div>
    </div>
  );
};

export default SignupOptions;
