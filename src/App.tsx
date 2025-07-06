import { ConfirmDialog, Modal } from '@components/index';
import type { CreateCustomerData, Customer } from '@domain/entities/Customer';
import { v } from '@domain/services/vocabulary/Vocabulary';
import { useCustomers } from '@hooks/useCustomers';
import React, { lazy, useState } from 'react';

const CustomerList = lazy(()=> import('./common/components/customer/CustomerList').then((module)=> ({
  default: module.CustomerList
})))

const CustomerForm = lazy(()=> import('./common/components/customer/CustomerForm').then((module)=> ({
  default: module.CustomerForm
})))

enum ViewMode {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
}

const App: React.FC = () => {
  const {
    customers,
    isLoading,
    errors,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    clearErrors,
  } = useCustomers();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleCreateCustomer = () => {
    clearErrors();
    setSelectedCustomer(null);
    setViewMode(ViewMode.CREATE);
  };

  const handleEditCustomer = (customer: Customer) => {
    clearErrors();
    setSelectedCustomer(customer);
    setViewMode(ViewMode.EDIT);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      const success = await deleteCustomer(customerToDelete);
      if (success) {
        setCustomerToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (data: CreateCustomerData) => {
    let success = false;

    if (viewMode === ViewMode.CREATE) {
      success = await createCustomer(data);
    } else if (viewMode === ViewMode.EDIT && selectedCustomer) {
      success = await updateCustomer({ ...data, id: selectedCustomer.id });
    }

    if (success) {
      setViewMode(ViewMode.LIST);
      setSelectedCustomer(null);
    }
  };

  const handleCancel = () => {
    setViewMode(ViewMode.LIST);
    setSelectedCustomer(null);
    clearErrors();
  };

  const customerToDeleteDetails = customerToDelete
    ? customers.find(c => c.id === customerToDelete)
    : null;

  return (
    <div className="flex flex-col logo min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{v.customer_management}</h1>
          <p className="mt-2 text-gray-600">{v.customer_desc}</p>
        </div>
        {viewMode === ViewMode.LIST && (
          <>
            <div className="mb-6">
              <button
                onClick={handleCreateCustomer}
                className="btn-primary"
              >
                {v.add_customer}
              </button>
            </div>
            <CustomerList
              customers={customers}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
              isLoading={isLoading}
            />
          </>
        )}
        <Modal
          isOpen={viewMode === ViewMode.CREATE || viewMode === ViewMode.EDIT}
          onClose={handleCancel}
        >
          <CustomerForm
            customer={selectedCustomer || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            errors={errors}
          />
        </Modal>
        <ConfirmDialog
          isOpen={!!customerToDelete}
          title="Delete Customer"
          message={
            customerToDeleteDetails
              ? `Are you sure you want to delete ${customerToDeleteDetails.firstName} ${customerToDeleteDetails.lastName}? This action cannot be undone.`
              : 'Are you sure you want to delete this customer?'
          }
          onConfirm={confirmDelete}
          onCancel={() => setCustomerToDelete(null)}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isLoading}
        />

        {errors.some(error => error.field === 'general') && (
          <div className="fixed bottom-4 z-51 right-4 max-w-sm">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors
                .filter(error => error.field === 'general')
                .map((error, index) => (
                  <p key={index}>{error.message}</p>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;