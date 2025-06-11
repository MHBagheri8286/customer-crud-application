import { useCallback, useEffect, useMemo, useState } from 'react';
import { createCustomerUseCases } from '../../application/use-cases/CustomerUseCases';
import { createCustomerService } from '../../domain/services/customer/CustomerService';
import { createLocalStorageCustomerRepository } from '../../infrastructure/storage/LocalStorageCustomerRepository';
import { createCustomerValidationService } from '../../domain/services/customer/CustomerValidationService';
import type { CreateCustomerData, Customer, UpdateCustomerData } from '@domain/entities/Customer';

export interface UseCustomersHook {
    customers: Customer[];
    isLoading: boolean;
    errors: Array<{ field: string; message: string }>;
    createCustomer: (data: CreateCustomerData) => Promise<boolean>;
    updateCustomer: (data: UpdateCustomerData) => Promise<boolean>;
    deleteCustomer: (id: string) => Promise<boolean>;
    refreshCustomers: () => Promise<void>;
    clearErrors: () => void;
}

export const useCustomers = (): UseCustomersHook => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);

    const customerUseCases = useMemo(() => {
        const customerRepository = createLocalStorageCustomerRepository();
        const validationService = createCustomerValidationService();
        const customerService = createCustomerService(customerRepository, validationService);
        return createCustomerUseCases(customerService);
    }, []); 

    const refreshCustomers = useCallback(async () => {
        setIsLoading(true);
        try {
            const customerList = await customerUseCases.getCustomers();
            setCustomers(customerList);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setErrors([{ field: 'general', message: 'Failed to fetch customers' }]);
        } finally {
            setIsLoading(false);
        }
    }, [customerUseCases]);

    useEffect(() => {
        refreshCustomers();
    }, [refreshCustomers]);

    const createCustomer = useCallback(
        async (data: CreateCustomerData): Promise<boolean> => {
            setIsLoading(true);
            setErrors([]);

            try {
                const result = await customerUseCases.createCustomer(data);

                if (result.success) {
                    await refreshCustomers();
                    return true;
                } else {
                    setErrors(result.errors || []);
                    return false;
                }
            } catch (error) {
                console.error('Error creating customer:', error);
                setErrors([{ field: 'general', message: 'Failed to create customer' }]);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [customerUseCases, refreshCustomers]
    );

    const updateCustomer = useCallback(
        async (data: UpdateCustomerData): Promise<boolean> => {
            setIsLoading(true);
            setErrors([]);

            try {
                const result = await customerUseCases.updateCustomer(data);

                if (result.success) {
                    await refreshCustomers();
                    return true;
                } else {
                    setErrors(result.errors || []);
                    return false;
                }
            } catch (error) {
                console.error('Error updating customer:', error);
                setErrors([{ field: 'general', message: 'Failed to update customer' }]);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [customerUseCases, refreshCustomers]
    );

    const deleteCustomer = useCallback(
        async (id: string): Promise<boolean> => {
            setIsLoading(true);
            setErrors([]);

            try {
                const result = await customerUseCases.deleteCustomer(id);

                if (result.success) {
                    await refreshCustomers();
                    return true;
                } else {
                    setErrors([{ field: 'general', message: result.error || 'Failed to delete customer' }]);
                    return false;
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                setErrors([{ field: 'general', message: 'Failed to delete customer' }]);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [customerUseCases, refreshCustomers]
    );

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);


    return {
        customers,
        isLoading,
        errors,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        refreshCustomers,
        clearErrors,
    };
};