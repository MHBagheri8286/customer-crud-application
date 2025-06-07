import {
    createCustomer,
    updateCustomer,
} from '../../entities/Customer';
import type { CreateCustomerData, Customer, UpdateCustomerData } from '../../models/Customer';
import type { CustomerRepository } from '../../repositories/CustomerRepository';
import type { CustomerValidationService } from './CustomerValidationService';

export interface CustomerServiceError {
    field: string;
    message: string;
}

export interface CustomerServiceResult<T> {
    success: boolean;
    data?: T;
    errors?: CustomerServiceError[];
}

export interface CustomerService {
    createCustomer(data: CreateCustomerData): Promise<CustomerServiceResult<Customer>>;
    updateCustomer(data: UpdateCustomerData): Promise<CustomerServiceResult<Customer>>;
    deleteCustomer(id: string): Promise<CustomerServiceResult<void>>;
    getCustomers(): Promise<Customer[]>;
    getCustomerById(id: string): Promise<Customer | null>;
}

export const createCustomerService = (
    repository: CustomerRepository,
    validationService: CustomerValidationService
): CustomerService => {

    const validateAndCreateCustomer = async (data: CreateCustomerData): Promise<CustomerServiceResult<Customer>> => {
        const errors: CustomerServiceError[] = [];
        // Validate phone number
        const isValidPhone = validationService.validatePhoneNumber(data.phoneNumber);
        if (!isValidPhone) {
            errors.push({ field: 'phoneNumber', message: 'Invalid mobile phone number' });
        }
        // Validate email format
        if (!validationService.validateEmail(data.email)) {
            errors.push({ field: 'email', message: 'Invalid email format' });
        }
        // Validate bank account number
        if (!validationService.validateBankAccountNumber(data.bankAccountNumber)) {
            errors.push({ field: 'bankAccountNumber', message: 'Invalid bank account number format' });
        }
        // Check email uniqueness
        const existingEmailCustomer = await repository.findByEmail(data.email);
        if (existingEmailCustomer) {
            errors.push({ field: 'email', message: 'Email already exists' });
        }
        // Check customer uniqueness (firstName + lastName + dateOfBirth)
        const existingCustomer = await repository.findByUniqueKey(
            data.firstName,
            data.lastName,
            data.dateOfBirth
        );
        if (existingCustomer) {
            errors.push({
                field: 'general',
                message: 'Customer with same name and date of birth already exists'
            });
        }

        if (errors.length > 0) {
            return { success: false, errors };
        }

        const customer = createCustomer(data);
        const savedCustomer = await repository.save(customer);

        return { success: true, data: savedCustomer };
    };

    const validateAndUpdateCustomer = async (data: UpdateCustomerData): Promise<CustomerServiceResult<Customer>> => {
        const errors: CustomerServiceError[] = [];

        const existingCustomer = await repository.findById(data.id);
        if (!existingCustomer) {
            return { success: false, errors: [{ field: 'id', message: 'Customer not found' }] };
        }

        // Validate phone number if provided
        if (data.phoneNumber) {
            const isValidPhone = await validationService.validatePhoneNumber(data.phoneNumber);
            if (!isValidPhone) {
                errors.push({ field: 'phoneNumber', message: 'Invalid mobile phone number' });
            }
        }

        // Validate email if provided
        if (data.email) {
            if (!validationService.validateEmail(data.email)) {
                errors.push({ field: 'email', message: 'Invalid email format' });
            }

            // Check email uniqueness (excluding current customer)
            const existingEmailCustomer = await repository.findByEmail(data.email);
            if (existingEmailCustomer && existingEmailCustomer.id !== data.id) {
                errors.push({ field: 'email', message: 'Email already exists' });
            }
        }

        // Validate bank account number if provided
        if (data.bankAccountNumber && !validationService.validateBankAccountNumber(data.bankAccountNumber)) {
            errors.push({ field: 'bankAccountNumber', message: 'Invalid bank account number format' });
        }

        // Check uniqueness if name or DOB is being updated
        if (data.firstName || data.lastName || data.dateOfBirth) {
            const firstName = data.firstName || existingCustomer.firstName;
            const lastName = data.lastName || existingCustomer.lastName;
            const dateOfBirth = data.dateOfBirth || existingCustomer.dateOfBirth;

            const duplicateCustomer = await repository.findByUniqueKey(
                firstName,
                lastName,
                dateOfBirth
            );

            if (duplicateCustomer && duplicateCustomer.id !== data.id) {
                errors.push({
                    field: 'general',
                    message: 'Customer with same name and date of birth already exists'
                });
            }
        }

        if (errors.length > 0) {
            return { success: false, errors };
        }

        const updatedCustomer = updateCustomer(existingCustomer, data);
        const savedCustomer = await repository.save(updatedCustomer);

        return { success: true, data: savedCustomer };
    };

    const removeCustomer = async (id: string): Promise<CustomerServiceResult<void>> => {
        const customer = await repository.findById(id);
        if (!customer) {
            return { success: false, errors: [{ field: 'id', message: 'Customer not found' }] };
        }

        await repository.delete(id);
        return { success: true };
    };

    const getAllCustomers = async (): Promise<Customer[]> => {
        return repository.findAll();
    };

    const findCustomerById = async (id: string): Promise<Customer | null> => {
        return repository.findById(id);
    };

    return {
        createCustomer: validateAndCreateCustomer,
        updateCustomer: validateAndUpdateCustomer,
        deleteCustomer: removeCustomer,
        getCustomers: getAllCustomers,
        getCustomerById: findCustomerById,
    };
};