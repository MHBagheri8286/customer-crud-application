import type { CreateCustomerData, Customer, UpdateCustomerData } from "@domain/models/Customer";
import type { CustomerService } from "./CustomerService";

export interface CustomerUseCases {
  createCustomer(data: CreateCustomerData): Promise<{ success: boolean; customer?: Customer; errors?: Array<{ field: string; message: string }> }>;
  updateCustomer(data: UpdateCustomerData): Promise<{ success: boolean; customer?: Customer; errors?: Array<{ field: string; message: string }> }>;
  deleteCustomer(id: string): Promise<{ success: boolean; error?: string }>;
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
}

export const createCustomerUseCases = (customerService: CustomerService): CustomerUseCases => {
  return {
    createCustomer: async (data: CreateCustomerData) => {
      const result = await customerService.createCustomer(data);
      return {
        success: result.success,
        customer: result.data,
        errors: result.errors,
      };
    },

    updateCustomer: async (data: UpdateCustomerData) => {
      const result = await customerService.updateCustomer(data);
      return {
        success: result.success,
        customer: result.data,
        errors: result.errors,
      };
    },

    deleteCustomer: async (id: string) => {
      const result = await customerService.deleteCustomer(id);
      return {
        success: result.success,
        error: result.errors?.[0]?.message,
      };
    },

    getCustomers: async () => {
      return customerService.getCustomers();
    },

    getCustomerById: async (id: string) => {
      return customerService.getCustomerById(id);
    },
  };
};