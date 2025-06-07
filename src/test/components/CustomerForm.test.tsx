import { CustomerForm } from '@components/customer/CustomerForm';
import type { Customer } from '@domain/models/Customer';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock all the imports
vi.mock('@domain/services/vocabulary/Vocabulary', () => ({
    v: {
        edit_customer: 'Edit Customer',
        add_customer: 'Add Customer',
        first_name: 'First Name',
        last_name: 'Last Name',
        date_of_birth: 'Date of Birth',
        phone_number: 'Phone Number',
        email: 'Email',
        bank_account_number: 'Bank Account Number',
        cancel: 'Cancel',
    }
}));

vi.mock('google-libphonenumber', () => ({
    PhoneNumberUtil: {
        getInstance: () => ({
            parse: vi.fn(() => ({})),
            isValidNumber: vi.fn(() => true),
            getNumberType: vi.fn(() => 0), // MOBILE type
        })
    },
    PhoneNumberType: {
        MOBILE: 0,
        FIXED_LINE_OR_MOBILE: 2,
    }
}));

describe('CustomerForm Component', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    const mockCustomer: Customer = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        bankAccountNumber: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should disable form when loading', () => {
        render(
            <CustomerForm
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
                isLoading={true}
            />
        );

        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeDisabled();
    });

    it('should show "Edit Customer" title when editing', () => {
        render(
            <CustomerForm
                customer={mockCustomer}
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getByText('Edit Customer')).toBeInTheDocument();
    });
});