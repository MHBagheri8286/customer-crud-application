import type { Customer } from "../models/Customer";

export interface CustomerRepository {
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    findByUniqueKey(firstName: string, lastName: string, dateOfBirth: string): Promise<Customer | null>;
    save(customer: Customer): Promise<Customer>;
    delete(id: string): Promise<void>;
}