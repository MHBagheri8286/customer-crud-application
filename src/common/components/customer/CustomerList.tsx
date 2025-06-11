import { v } from "@domain/services/vocabulary/Vocabulary";
import { Button } from "../Button";
import type { Customer } from "@domain/entities/Customer";

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  isLoading?: boolean;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">{v.loading_customers}</div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{v.no_customers}</h3>
        <p className="text-gray-500">{v.add_your_first_customer}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {customers.map((customer) => (
          <li key={customer.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-800 font-medium text-md">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-left font-medium text-gray-900 truncate">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-left text-gray-500 truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="truncate">
                    {v.date_of_birth}: {formatDate(customer.dateOfBirth)} •
                    {v.phone_number}: {customer.phoneNumber} •
                    {v.account}: {customer.bankAccountNumber}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  text={v.edit}
                  variant="secondary"
                  className="!px-3 !py-1 !text-xs !font-medium !rounded-full !bg-gray-100 !text-primary-800 hover:!bg-gray-200 inline-flex items-center"
                  onClick={() => onEdit(customer)}
                />
                <Button
                  text={v.delete}
                  variant="secondary"
                  className="!px-3 !py-1 !text-xs !font-medium !rounded-full !bg-red-100 !text-red-800 hover:!bg-red-200 inline-flex items-center"
                  onClick={() => onDelete(customer.id)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};