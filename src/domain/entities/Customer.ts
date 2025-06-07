import type { CreateCustomerData, Customer } from "../models/Customer";

export const createCustomer = (data: CreateCustomerData): Customer => {
    const now = new Date();
    console.log(data);
    
    return {
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,
        bankAccountNumber: data.bankAccountNumber,
        createdAt: now,
        updatedAt: now,
    };
};

export const updateCustomer = (
    customer: Customer,
    data: Partial<CreateCustomerData>
): Customer => {
    return {
        ...customer,
        firstName: data.firstName ?? customer.firstName,
        lastName: data.lastName ?? customer.lastName,
        dateOfBirth: data.dateOfBirth ?? customer.dateOfBirth,
        phoneNumber: data.phoneNumber ?? customer.phoneNumber,
        email: data.email ?? customer.email,
        bankAccountNumber: data.bankAccountNumber ?? customer.bankAccountNumber,
        updatedAt: new Date(),
    };
};

export const getCustomerFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`;
};

export const getCustomerUniqueKey = (customer: Customer): string => {
    return `${customer.firstName}-${customer.lastName}-${customer.dateOfBirth}`;
};