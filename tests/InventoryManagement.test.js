import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InventoryManagement from '../src/components/Staff/InventoryManagement';
import { getAuth } from 'firebase/auth';
import { getDocs, updateDoc, addDoc, doc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock Firebase methods
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com', uid: 'testuid' }
  })
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    empty: false,
    docs: [
      {
        id: '1',
        data: () => ({ name: 'Item 1', quantity: 10, price: 5 })
      }
    ]
  }),
  addDoc: jest.fn().mockResolvedValue({ id: '2' }),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn()
}));

describe('InventoryManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render inventory items', async () => {
    await act(async () => {
      render(<InventoryManagement />);
    });

    const header = await screen.findByText('Inventory Management');
    expect(header).toBeInTheDocument();
    const itemName = await screen.findByText('Item 1 - 10');
    expect(itemName).toBeInTheDocument();
  });

  it('should update item quantity and show toast notification', async () => {
    await act(async () => {
      render(<InventoryManagement />);
    });

    const quantityInput = await screen.findByDisplayValue('10');
    fireEvent.change(quantityInput, { target: { value: '20' } });

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled();
      expect(screen.getByText('Item quantity updated to 20')).toBeInTheDocument();
    });
  });

});
