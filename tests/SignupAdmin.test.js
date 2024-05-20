import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import SignupAdmin from '../src/components/Admin/SignupAdmin'; // Adjust the path as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com' }
  }),
  createUserWithEmailAndPassword: jest.fn(),
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

describe('SignupAdmin Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    // Mock Firestore data
    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ currentId: 1 })
    });
  });

  it('should render the sign-up form', () => {
    render(
      <Router>
        <SignupAdmin />
      </Router>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shop name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shop category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/shop image url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(
      <Router>
        <SignupAdmin />
      </Router>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const shopNameInput = screen.getByLabelText(/shop name/i);
    const shopCategorySelect = screen.getByLabelText(/shop category/i);
    const shopImageInput = screen.getByLabelText(/shop image url/i);

    fireEvent.change(nameInput, { target: { value: 'Test Admin' } });
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(shopNameInput, { target: { value: 'Test Shop' } });
    fireEvent.change(shopCategorySelect, { target: { value: 'mini-supermarket' } });
    fireEvent.change(shopImageInput, { target: { value: 'http://example.com/shop.jpg' } });

    expect(nameInput.value).toBe('Test Admin');
    expect(emailInput.value).toBe('admin@example.com');
    expect(passwordInput.value).toBe('Password123!');
    expect(shopNameInput.value).toBe('Test Shop');
    expect(shopCategorySelect.value).toBe('mini-supermarket');
    expect(shopImageInput.value).toBe('http://example.com/shop.jpg');
  });

  it('should handle successful signup', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'testuid' }
    });

    await act(async () => {
      render(
        <Router>
          <SignupAdmin />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test Admin' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/shop name/i), { target: { value: 'Test Shop' } });
    fireEvent.change(screen.getByLabelText(/shop category/i), { target: { value: 'mini-supermarket' } });
    fireEvent.change(screen.getByLabelText(/shop image url/i), { target: { value: 'http://example.com/shop.jpg' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admindashboard'));
  });

  it('should handle signup error', async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Signup failed'));

    await act(async () => {
      render(
        <Router>
          <SignupAdmin />
        </Router>
      );
    });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test Admin' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/shop name/i), { target: { value: 'Test Shop' } });
    fireEvent.change(screen.getByLabelText(/shop category/i), { target: { value: 'mini-supermarket' } });
    fireEvent.change(screen.getByLabelText(/shop image url/i), { target: { value: 'http://example.com/shop.jpg' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    const errorMessage = await screen.findByText(/signup failed/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
