import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCustomer, getCustomerUniqueKey, updateCustomer } from '../../domain/entities/Customer';
import type { CreateCustomerData, Customer } from '../../domain/models/Customer';

// Create typed mocks
const randomUUID = 'test-uuid-123';
const mockRandomUUID = vi.fn(() => randomUUID);
const mockOldDate = new Date('2024-01-01T10:30:00.000Z');
const mockNewDate = new Date('2024-01-15T10:30:00.000Z');
// Mock crypto with proper typing
Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: mockRandomUUID },
    writable: true,
});

const dateConstructorSpy = vi.spyOn(global, 'Date').mockImplementation(() => mockOldDate);

describe('Customer Entity Functions', () => {
    const mockCustomerData: CreateCustomerData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        phoneNumber: '+1234567890',
        email: 'john.doe@example.com',
        bankAccountNumber: '1234567890123456',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        dateConstructorSpy.mockImplementation(() => mockOldDate);
        mockRandomUUID.mockReturnValue(randomUUID);
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('createCustomer', () => {
        it('should create a customer with all required fields', () => {
            const customer = createCustomer(mockCustomerData);

            expect(customer).toEqual({
                id: randomUUID,
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-05-15',
                phoneNumber: '+1234567890',
                email: 'john.doe@example.com',
                bankAccountNumber: '1234567890123456',
                createdAt: mockOldDate,
                updatedAt: mockOldDate,
            });
        });

        it('should generate a unique ID using crypto.randomUUID', () => {
            createCustomer(mockCustomerData);

            expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
        });

        it('should set createdAt and updatedAt to the same timestamp', () => {
            const customer = createCustomer(mockCustomerData);

            expect(customer.createdAt).toBe(customer.updatedAt);
            expect(customer.createdAt).toEqual(mockOldDate);
        });

        it('should handle different customer data correctly', () => {
            const differentData: CreateCustomerData = {
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '1985-12-20',
                phoneNumber: '+9876543210',
                email: 'jane.smith@example.com',
                bankAccountNumber: '9876543210987654',
            };

            const customer = createCustomer(differentData);

            expect(customer.firstName).toBe('Jane');
            expect(customer.lastName).toBe('Smith');
            expect(customer.email).toBe('jane.smith@example.com');
        });
    });

    describe('updateCustomer', () => {
        let existingCustomer: Customer;

        beforeEach(() => {
            existingCustomer = {
                id: randomUUID,
                firstName: 'John',
                lastName: 'Doe',
                dateOfBirth: '1990-05-15',
                phoneNumber: '+1234567890',
                email: 'john.doe@example.com',
                bankAccountNumber: '1234567890123456',
                createdAt: mockOldDate,
                updatedAt: mockOldDate,
            };
        });

        it('should update only provided fields', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updateData = {
                firstName: 'Johnny',
                email: 'johnny.doe@example.com',
            };

            const updatedCustomer = updateCustomer(existingCustomer, updateData);

            expect(updatedCustomer).toEqual({
                ...existingCustomer,
                firstName: 'Johnny',
                email: 'johnny.doe@example.com',
                updatedAt: mockNewDate, // Should be new date, not old date
            });
        });

        it('should preserve unchanged fields', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updateData = { firstName: 'Johnny' };

            const updatedCustomer = updateCustomer(existingCustomer, updateData);

            expect(updatedCustomer.lastName).toBe(existingCustomer.lastName);
            expect(updatedCustomer.dateOfBirth).toBe(existingCustomer.dateOfBirth);
            expect(updatedCustomer.phoneNumber).toBe(existingCustomer.phoneNumber);
            expect(updatedCustomer.bankAccountNumber).toBe(existingCustomer.bankAccountNumber);
            expect(updatedCustomer.createdAt).toBe(existingCustomer.createdAt);
            expect(updatedCustomer.id).toBe(existingCustomer.id);
        });

        it('should update the updatedAt timestamp', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updateData = { firstName: 'Johnny' };

            const updatedCustomer = updateCustomer(existingCustomer, updateData);

            expect(updatedCustomer.updatedAt).toEqual(mockNewDate);
            expect(updatedCustomer.updatedAt).not.toBe(existingCustomer.updatedAt);
            expect(updatedCustomer.updatedAt).not.toEqual(existingCustomer.updatedAt);
        });

        it('should handle partial updates correctly', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updateData = {
                lastName: 'Johnson',
                phoneNumber: '+9999999999',
            };

            const updatedCustomer = updateCustomer(existingCustomer, updateData);

            expect(updatedCustomer.lastName).toBe('Johnson');
            expect(updatedCustomer.phoneNumber).toBe('+9999999999');
            expect(updatedCustomer.firstName).toBe(existingCustomer.firstName);
        });

        it('should handle empty update data', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updatedCustomer = updateCustomer(existingCustomer, {});

            expect(updatedCustomer).toEqual({
                ...existingCustomer,
                updatedAt: mockNewDate,
            });
        });

        it('should handle all fields being updated', () => {
            dateConstructorSpy.mockImplementation(() => mockNewDate);
            
            const updateData: Partial<CreateCustomerData> = {
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '1985-12-20',
                phoneNumber: '+9876543210',
                email: 'jane.smith@example.com',
                bankAccountNumber: '9876543210987654',
            };

            const updatedCustomer = updateCustomer(existingCustomer, updateData);

            expect(updatedCustomer).toEqual({
                ...existingCustomer,
                ...updateData,
                updatedAt: mockNewDate, // Should be new date
            });
        });
    });

    describe('getCustomerUniqueKey', () => {
        it('should return the unique key in correct format', () => {
          const customer: Customer = {
            id: 'test-id',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-05-15',
            phoneNumber: '+1234567890',
            email: 'john.doe@example.com',
            bankAccountNumber: '1234567890123456',
            createdAt: mockOldDate,
            updatedAt: mockOldDate,
          };
    
          const uniqueKey = getCustomerUniqueKey(customer);
    
          expect(uniqueKey).toBe('John-Doe-1990-05-15');
        });
    
        it('should handle names with spaces correctly', () => {
          const customer: Customer = {
            id: 'test-id',
            firstName: 'Mary Jane',
            lastName: 'Smith Watson',
            dateOfBirth: '1985-12-20',
            phoneNumber: '+1234567890',
            email: 'mary.smith@example.com',
            bankAccountNumber: '1234567890123456',
            createdAt: mockOldDate,
            updatedAt: mockOldDate,
          };
    
          const uniqueKey = getCustomerUniqueKey(customer);
    
          expect(uniqueKey).toBe('Mary Jane-Smith Watson-1985-12-20');
        });
    
        it('should create different keys for different customers', () => {
          const customer1: Customer = {
            id: 'test-id-1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-05-15',
            phoneNumber: '+1234567890',
            email: 'john.doe@example.com',
            bankAccountNumber: '1234567890123456',
            createdAt: mockOldDate,
            updatedAt: mockOldDate,
          };
    
          const customer2: Customer = {
            id: 'test-id-2',
            firstName: 'Jane',
            lastName: 'Doe',
            dateOfBirth: '1990-05-15',
            phoneNumber: '+1234567891',
            email: 'jane.doe@example.com',
            bankAccountNumber: '1234567890123457',
            createdAt: mockOldDate,
            updatedAt: mockOldDate,
          };
    
          const key1 = getCustomerUniqueKey(customer1);
          const key2 = getCustomerUniqueKey(customer2);
    
          expect(key1).toBe('John-Doe-1990-05-15');
          expect(key2).toBe('Jane-Doe-1990-05-15');
          expect(key1).not.toBe(key2);
        });
    
        it('should handle special characters in names', () => {
          const customer: Customer = {
            id: 'test-id',
            firstName: 'José',
            lastName: "O'Connor",
            dateOfBirth: '1975-03-10',
            phoneNumber: '+1234567890',
            email: 'jose.oconnor@example.com',
            bankAccountNumber: '1234567890123456',
            createdAt: mockOldDate,
            updatedAt: mockOldDate,
          };
    
          const uniqueKey = getCustomerUniqueKey(customer);
    
          expect(uniqueKey).toBe("José-O'Connor-1975-03-10");
        });
      });
});