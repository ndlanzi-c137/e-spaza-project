import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupShopper from '../src/components/Shopper/SignupShopper'; // Adjust the path as needed
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com' }
  }),
  createUserWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SignupShopper Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render the sign-up form', () => {
    render(
      <Router>
        <SignupShopper />
      </Router>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(
      <Router>
        <SignupShopper />
      </Router>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('Password123!');
  });

  it('should handle successful signup', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ currentId: 1 })
    });

    await act(async () => {
      render(
        <Router>
          <SignupShopper />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shopperdashboard'));
  });

  it('should handle signup error', async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Signup failed'));

    await act(async () => {
      render(
        <Router>
          <SignupShopper />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const errorMessage = await screen.findByText(/signup failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should handle Google sign-up', async () => {
    signInWithPopup.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ currentId: 1 })
    });

    await act(async () => {
      render(
        <Router>
          <SignupShopper />
        </Router>
      );
    });

    fireEvent.click(screen.getByAltText(/sign up with google/i));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shopperdashboard'));
  });
});
