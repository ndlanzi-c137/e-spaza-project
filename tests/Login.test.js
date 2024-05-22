import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Login from '../src/components/Login';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com' }
  }),
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate); // Ensure useNavigate mock returns mockNavigate
  });

  it('should render the login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password');
  });

  it('should handle successful login', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ role: 'shopper' })
    });

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shopperdashboard'));
  });

  it('should handle login error', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Login failed'));

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/login failed. please check your credentials and try again./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should handle Google sign-in', async () => {
    signInWithPopup.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ role: 'shopper' })
    });

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.click(screen.getByAltText(/sign in with google/i));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/shopperdashboard'));
  });

  it('should navigate to staff dashboard', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'testuid' } });
    getDoc.mockResolvedValue({ exists: jest.fn().mockReturnValue(true), data: jest.fn().mockReturnValue({ role: 'staff' }) });

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/staffdashboard'));
  });

  it('should navigate to admin dashboard', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'testuid' } });
    getDoc.mockResolvedValue({ exists: jest.fn().mockReturnValue(true), data: jest.fn().mockReturnValue({ role: 'admin' }) });

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admindashboard'));
  });

  it('should handle unknown role', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'testuid' } });
    getDoc.mockResolvedValue({ exists: jest.fn().mockReturnValue(true), data: jest.fn().mockReturnValue({ role: 'unknown' }) });

    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/error determining user role. please contact support./i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should handle user data not found', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: 'testuid' } });
    getDoc.mockResolvedValue({ exists: jest.fn().mockReturnValue(false) });
  
    await act(async () => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });
  
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    const errorMessage = await screen.findByText((content, element) => {
      return content.startsWith('Error determining user role');
    });
    expect(errorMessage).toBeInTheDocument();
  });
  

});
