import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupStaff from '../src/components/Staff/SignupStaff'; // Adjust the path as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com' }
  }),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SignupStaff Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    // Mocking Firestore data
    getDocs.mockResolvedValue({
      docs: [
        { id: 'shop1', data: () => ({ name: 'Test Shop 1' }) },
        { id: 'shop2', data: () => ({ name: 'Test Shop 2' }) },
      ],
    });

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ currentId: 1 })
    });
  });

  it('should render the sign-up form', () => {
    render(
      <Router>
        <SignupStaff />
      </Router>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select shop/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle input changes', async () => {
    await act(async () => {
      render(
        <Router>
          <SignupStaff />
        </Router>
      );
    });

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const shopSelect = screen.getByLabelText(/select shop/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(shopSelect, { target: { value: 'shop1' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('Password123!');
    expect(shopSelect.value).toBe('shop1');
  });

  it('should handle successful signup', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    await act(async () => {
      render(
        <Router>
          <SignupStaff />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/select shop/i), { target: { value: 'shop1' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/staffdashboard'));
  });

  it('should handle signup error', async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Signup failed'));

    await act(async () => {
      render(
        <Router>
          <SignupStaff />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/select shop/i), { target: { value: 'shop1' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const errorMessage = await screen.findByText(/signup failed/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
