import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OrderManagement from '../src/components/Staff/OrderManagement';
import { getAuth } from 'firebase/auth';
import { getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

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
        data: () => ({ shopId: 'shop1', items: [{ name: 'Item 1', quantity: 1, price: 10 }], status: 'pending', shopperId: 'shopper1', total: 10 })
      }
    ]
  }),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({ name: 'Shopper 1' })
  }),
  query: jest.fn(),
  where: jest.fn()
}));

describe('OrderManagement Component', () => {
  it('should render orders', async () => {
    render(<OrderManagement />);
    const header = await screen.findByText('Order Management');
    expect(header).toBeInTheDocument();
    const customerName = await screen.findByText('Customer: Shopper 1');
    expect(customerName).toBeInTheDocument();
  });

  it('should update order status', async () => {
    render(<OrderManagement />);

    const orderItem = await screen.findByText('Customer: Shopper 1');
    expect(orderItem).toBeInTheDocument();

    const packingButton = screen.getByText('packing');
    fireEvent.click(packingButton);

    await waitFor(() => expect(updateDoc).toHaveBeenCalled());
  });
});
