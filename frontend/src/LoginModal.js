import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css'; // Import CSS for styling the modal

Modal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, purpose }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
    onRequestClose();
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
    onRequestClose();
  };

  const renderModalContent = () => {
    if (purpose === 'login') {
      return (
        <>
          <h2>Logg Inn</h2>
          <p>Vennligst logg inn for å fortsette.</p>
          <button onClick={handleLoginRedirect} className="login-modal-button">
            Logg Inn
          </button>
          <button onClick={handleSignupRedirect} className="signup-modal-button">
            Opprett Konto
          </button>
        </>
      );
    } else if (purpose === 'nyauksjon') {
      return (
        <>
          <h2>Vennligst logg inn</h2>
          <p>Du må være logget inn for å få tilgang til denne funksjonen.</p>
          <button onClick={handleLoginRedirect} className="login-modal-button">
            Logg Inn
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Required"
      className="login-modal"
      overlayClassName="login-modal-overlay"
    >
      <div className="login-modal-content">
        {renderModalContent()}
        <button onClick={onRequestClose} className="login-modal-close-button">
          Lukk
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
