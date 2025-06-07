import type { Customer } from "../../domain/models/Customer";
import type { CustomerRepository } from "../../domain/repositories/CustomerRepository";

const STORAGE_KEY = 'customers';

const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
};

const findAll = async (): Promise<Customer[]> => {
  return getCustomers();
};

const findById = async (id: string): Promise<Customer | null> => {
  const customers = getCustomers();
  return customers.find(c => c.id === id) || null;
};

const findByEmail = async (email: string): Promise<Customer | null> => {
  const customers = getCustomers();
  return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
};

const findByUniqueKey = async (
  firstName: string, 
  lastName: string, 
  dateOfBirth: string
): Promise<Customer | null> => {
  const customers = getCustomers();
  return customers.find(c => 
    c.firstName.toLowerCase() === firstName.toLowerCase() &&
    c.lastName.toLowerCase() === lastName.toLowerCase() &&
    c.dateOfBirth === dateOfBirth
  ) || null;
};

const save = async (customer: Customer): Promise<Customer> => {
  const customers = getCustomers();
  const existingIndex = customers.findIndex(c => c.id === customer.id);
  
  if (existingIndex >= 0) {
    customers[existingIndex] = customer;
  } else {
    customers.push(customer);
  }
  
  saveCustomers(customers);
  return customer;
};

const deleteCustomer = async (id: string): Promise<void> => {
  const customers = getCustomers();
  const filteredCustomers = customers.filter(c => c.id !== id);
  saveCustomers(filteredCustomers);
};

export const createLocalStorageCustomerRepository = (): CustomerRepository => ({
  findAll,
  findById,
  findByEmail,
  findByUniqueKey,
  save,
  delete: deleteCustomer,
});