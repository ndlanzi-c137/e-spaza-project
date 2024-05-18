import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InventoryManagement from '../src/components/Staff/InventoryManagement';

// Mock Firebase methods
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(),
    getDocs: jest.fn().mockResolvedValue({
      empty: false,
      docs: [
        {
          id: '1',
          data: () => ({ shopId: 'shop1', email: 'testuser@example.com' })
        }
      ]
    }),
    getDoc: jest.fn().mockResolvedValue({
      exists: () => true,
      data: () => ({ name: 'Test Shop', category: 'Grocery' })
    }),
    addDoc: jest.fn().mockResolvedValue({
      id: 'newItemId'
    }),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    where: jest.fn()
  };
});

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { email: 'testuser@example.com' }
  })
}));

describe('InventoryManagement Component', () => {
  it('should render inventory items', async () => {
    render(<InventoryManagement />);
    const header = await screen.findByText('Inventory Management');
    expect(header).toBeInTheDocument();
  });

  it('should add a new item', async () => {
    render(<InventoryManagement />);

    fireEvent.change(screen.getByPlaceholderText('Item Name'), {
      target: { value: 'Test Item' }
    });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), {
      target: { value: '10' }
    });
    fireEvent.change(screen.getByPlaceholderText('Price'), {
      target: { value: '100' }
    });
    fireEvent.click(screen.getByText('Add Item'));

  });
});
