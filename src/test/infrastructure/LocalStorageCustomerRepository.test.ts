import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLocalStorageCustomerRepository } from './../../infrastructure/storage/LocalStorageCustomerRepository';
import type { Customer } from '@domain/entities/Customer';

describe('LocalStorage Customer Repository', () => {
  let repository: ReturnType<typeof createLocalStorageCustomerRepository>;
  
  const mockCustomer1: Customer = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01',
    bankAccountNumber: '123456789',
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  const mockCustomer2: Customer = {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+1987654321',
    dateOfBirth: '1985-05-15',
    bankAccountNumber: '987654321',
    createdAt: new Date('2024-01-02T14:30:00.000Z'),
    updatedAt: new Date('2024-01-02T14:30:00.000Z'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = createLocalStorageCustomerRepository();
  });

  describe('findAll', () => {
    it('should return empty array when no customers exist', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);

      const customers = await repository.findAll();

      expect(customers).toEqual([]);
      expect(window.localStorage.getItem).toHaveBeenCalledWith('customers');
    });

    it('should return all customers from localStorage', async () => {
      const storedCustomers = [
        {
          ...mockCustomer1,
          createdAt: mockCustomer1.createdAt.toISOString(),
          updatedAt: mockCustomer1.updatedAt.toISOString(),
        },
        {
          ...mockCustomer2,
          createdAt: mockCustomer2.createdAt.toISOString(),
          updatedAt: mockCustomer2.updatedAt.toISOString(),
        }
      ];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedCustomers));

      const customers = await repository.findAll();

      expect(customers).toEqual(storedCustomers);
      expect(customers).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return customer when found by id', async () => {
      const storedCustomers = [
        {
          ...mockCustomer1,
          createdAt: mockCustomer1.createdAt.toISOString(),
          updatedAt: mockCustomer1.updatedAt.toISOString(),
        },
        {
          ...mockCustomer2,
          createdAt: mockCustomer2.createdAt.toISOString(),
          updatedAt: mockCustomer2.updatedAt.toISOString(),
        }
      ];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedCustomers));

      const customer = await repository.findById('1');

      expect(customer).toEqual(storedCustomers[0]);
    });

    it('should return null when customer not found', async () => {
      const storedCustomer = {
        ...mockCustomer1,
        createdAt: mockCustomer1.createdAt.toISOString(),
        updatedAt: mockCustomer1.updatedAt.toISOString(),
      };
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify([storedCustomer]));

      const customer = await repository.findById('999');

      expect(customer).toBeNull();
    });
  });

  describe('findByEmail', () => {
    beforeEach(() => {
      const storedCustomers = [
        {
          ...mockCustomer1,
          createdAt: mockCustomer1.createdAt.toISOString(),
          updatedAt: mockCustomer1.updatedAt.toISOString(),
        },
        {
          ...mockCustomer2,
          createdAt: mockCustomer2.createdAt.toISOString(),
          updatedAt: mockCustomer2.updatedAt.toISOString(),
        }
      ];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedCustomers));
    });

    it('should return customer when found by email', async () => {
      const customer = await repository.findByEmail('john.doe@example.com');

      expect(customer?.email).toBe('john.doe@example.com');
      expect(customer?.firstName).toBe('John');
    });

    it('should return customer when found by email (case insensitive)', async () => {
      const customer = await repository.findByEmail('JOHN.DOE@EXAMPLE.COM');

      expect(customer?.email).toBe('john.doe@example.com');
      expect(customer?.firstName).toBe('John');
    });

    it('should return null when customer not found', async () => {
      const customer = await repository.findByEmail('notfound@example.com');

      expect(customer).toBeNull();
    });
  });

  describe('findByUniqueKey', () => {
    beforeEach(() => {
      const storedCustomers = [
        {
          ...mockCustomer1,
          createdAt: mockCustomer1.createdAt.toISOString(),
          updatedAt: mockCustomer1.updatedAt.toISOString(),
        },
        {
          ...mockCustomer2,
          createdAt: mockCustomer2.createdAt.toISOString(),
          updatedAt: mockCustomer2.updatedAt.toISOString(),
        }
      ];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(storedCustomers));
    });

    it('should return customer when found by unique key', async () => {
      const customer = await repository.findByUniqueKey('John', 'Doe', '1990-01-01');

      expect(customer?.firstName).toBe('John');
      expect(customer?.lastName).toBe('Doe');
      expect(customer?.dateOfBirth).toBe('1990-01-01');
    });

    it('should return customer when found by unique key (case insensitive)', async () => {
      const customer = await repository.findByUniqueKey('JOHN', 'DOE', '1990-01-01');

      expect(customer?.firstName).toBe('John');
      expect(customer?.lastName).toBe('Doe');
    });

    it('should return null when customer not found', async () => {
      const customer = await repository.findByUniqueKey('John', 'Doe', '1991-01-01');

      expect(customer).toBeNull();
    });
  });

  describe('save', () => {
    it('should save new customer', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      window.localStorage.setItem = vi.fn();

      const savedCustomer = await repository.save(mockCustomer1);

      expect(savedCustomer).toEqual(mockCustomer1);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify([mockCustomer1])
      );
    });

    it('should update existing customer', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify([mockCustomer1]));
      window.localStorage.setItem = vi.fn();

      const updatedCustomer = { ...mockCustomer1, firstName: 'Johnny' };
      const savedCustomer = await repository.save(updatedCustomer);

      expect(savedCustomer).toEqual(updatedCustomer);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify([updatedCustomer])
      );
    });

    it('should add customer to existing list', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify([mockCustomer1]));
      window.localStorage.setItem = vi.fn();

      const savedCustomer = await repository.save(mockCustomer2);

      expect(savedCustomer).toEqual(mockCustomer2);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify([mockCustomer1, mockCustomer2])
      );
    });
  });

  describe('delete', () => {
    it('should delete customer by id', async () => {
      const mockCustomers = [mockCustomer1, mockCustomer2];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockCustomers));
      window.localStorage.setItem = vi.fn();

      await repository.delete('1');

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify([mockCustomer2])
      );
    });

    it('should handle deleting non-existent customer', async () => {
      const mockCustomers = [mockCustomer1, mockCustomer2];
      window.localStorage.getItem = vi.fn().mockReturnValue(JSON.stringify(mockCustomers));
      window.localStorage.setItem = vi.fn();

      await repository.delete('999');

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify(mockCustomers)
      );
    });

    it('should handle deleting from empty repository', async () => {
      window.localStorage.getItem = vi.fn().mockReturnValue(null);
      window.localStorage.setItem = vi.fn();

      await repository.delete('1');

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'customers',
        JSON.stringify([])
      );
    });
  });
});