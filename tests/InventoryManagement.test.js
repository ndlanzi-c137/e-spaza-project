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
        data: () => ({shopId: 'shop1', name: 'Item 1', quantity: 10, price: 5 })
      },
      {
        id: '2',
        data: () => ({shopId: 'shop1', name: 'Item 2', quantity: 5, price: 10 })
      }
    ]
  }),
  addDoc: jest.fn().mockResolvedValue({ id: '3' }),
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

  it('should add a new item', async () => {
    await act(async () => {
      render(<InventoryManagement />);
    });

    // Mock setting shopId
    fireEvent.change(screen.getByPlaceholderText('Item Name'), { target: { value: 'New Item' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '15' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '7.5' } });
    fireEvent.change(screen.getByPlaceholderText('Image URL'), { target: { value: 'http://example.com/image.jpg' } });

    console.log('Adding new item...');
    console.log('New item values:', {
      name: screen.getByPlaceholderText('Item Name').value,
      quantity: screen.getByPlaceholderText('Quantity').value,
      price: screen.getByPlaceholderText('Price').value,
      imageUrl: screen.getByPlaceholderText('Image URL').value,
    });

    fireEvent.click(screen.getByText('Add Item'));

    console.log(screen.debug());

    
    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(screen.getByText('Item New Item added successfully')).toBeInTheDocument();
    });
  });

  it('should not add a new item if required fields are missing', async () => {
    await act(async () => {
      render(<InventoryManagement />);
    });

    fireEvent.change(screen.getByPlaceholderText('Item Name'), {target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Image URL'), { target: { value: '' } });

    fireEvent.click(screen.getByText('Add Item'));

    await waitFor(() => {
      expect(addDoc).not.toHaveBeenCalled();
      expect(screen.queryByText('Item added successfully')).not.toBeInTheDocument();
    });
  });

});

