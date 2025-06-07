export interface CreateCustomerData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    bankAccountNumber: string;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
    id: string;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    bankAccountNumber: string;
    createdAt: Date;
    updatedAt: Date;
}