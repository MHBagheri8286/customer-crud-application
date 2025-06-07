import type { CreateCustomerData, Customer } from '@domain/models/Customer';
import { validatePhoneNumber } from '@domain/services/customer/CustomerValidationService';
import { v } from '@domain/services/vocabulary/Vocabulary';
import { yupResolver } from '@hookform/resolvers/yup';
import { nameof } from '@utils/Util';
import { useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '../Button';
import { Input } from '../Input';

const CustomerFormSchema = yup.object({
    firstName: yup.string().required('First name is required').max(50),
    lastName: yup.string().required('Last name is required').max(50),
    dateOfBirth: yup.string().required('Date of birth is required'),
    phoneNumber: yup.string().required('Phone number is required')
        .test('valid-phone', 'Please enter a valid phone number', (value) => {
            if (!value) return false;
            try {
                return validatePhoneNumber(value);
            } catch {
                return false;
            }
        }),
    email: yup.string().email('Invalid email format').required('Email is required'),
    bankAccountNumber: yup.string()
        .required('Bank account number is required')
});

interface CustomerFormProps {
    customer?: Customer;
    onSubmit: (data: CreateCustomerData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    errors?: Array<{ field: string; message: string }>;
}

export const CustomerForm: FC<CustomerFormProps> = ({
    customer,
    onSubmit,
    onCancel,
    isLoading = false,
    errors = [],
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
        setError,
    } = useForm<CreateCustomerData>({
        resolver: yupResolver(CustomerFormSchema),
        defaultValues: customer ? {
            firstName: customer.firstName,
            lastName: customer.lastName,
            dateOfBirth: customer.dateOfBirth,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            bankAccountNumber: customer.bankAccountNumber,
        } : undefined,
    });

    useEffect(() => {
        errors.forEach(error => {
            if (error.field !== 'general') {
                setError(error.field as keyof CreateCustomerData, {
                    type: 'server',
                    message: error.message,
                });
            }
        });
    }, [errors, setError]);

    return (
        <div className="max-w-md mx-auto bg-white p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
                {customer ? v.edit_customer : v.add_customer}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    name={nameof<CreateCustomerData>('firstName')}
                    label={v.first_name}
                    register={register}
                    error={formErrors.firstName}
                    disabled={isLoading}
                    required
                />
                <Input
                    name={nameof<CreateCustomerData>('lastName')}
                    label={v.last_name}
                    register={register}
                    error={formErrors.lastName}
                    disabled={isLoading}
                    required
                />
                <Input
                    name={nameof<CreateCustomerData>('dateOfBirth')}
                    label={v.date_of_birth}
                    type='date'
                    register={register}
                    error={formErrors.dateOfBirth}
                    disabled={isLoading}
                    required
                />
                <Input
                    name={nameof<CreateCustomerData>('phoneNumber')}
                    label={v.phone_number}
                    placeholder='+0123456789'
                    type="tel"
                    register={register}
                    error={formErrors.phoneNumber}
                    disabled={isLoading}
                    required
                />
                <Input
                    name={nameof<CreateCustomerData>('email')}
                    label={v.email}
                    type="email"
                    register={register}
                    error={formErrors.email}
                    disabled={isLoading}
                    required
                />
                <Input
                    name={nameof<CreateCustomerData>('bankAccountNumber')}
                    label={v.bank_account_number}
                    register={register}
                    error={formErrors.bankAccountNumber}
                    disabled={isLoading}
                    required
                />
                <div className="flex space-x-4 pt-4">
                    <Button
                        text={isLoading ? 'Saving...' : (customer ? 'Update Customer' : 'Add Customer')}
                        variant='primary'
                        disabled={isLoading}
                        fullWidth
                        type='submit'
                    />
                    <Button
                        text={v.cancel}
                        variant='secondary'
                        disabled={isLoading}
                        fullWidth
                        onClick={onCancel}
                    />
                </div>
            </form>
        </div>
    );
};