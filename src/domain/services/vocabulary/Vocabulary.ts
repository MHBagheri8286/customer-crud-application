export const vocab = {
    // Common
    loading: 'Loading...',
    processing: 'Processing...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    // Customer specific
    loading_customers: 'Loading customers...',
    customer_management:'Customer Management',
    customer_desc: 'Manage your customer database with CRUD operations',
    add_your_first_customer: 'Add your first customer to get started.',
    no_customers: 'No customers found',
    save_customer: 'Save Customer',
    add_customer: 'Add New Customer',
    update_customer: 'Edit Customer',
    saving: 'Saving...',
    customer_saved: 'Customer saved successfully',
    customer_deleted: 'Customer deleted successfully',
    // Form fields
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    phone_number: 'Phone',
    date_of_birth: 'Date of Birth',
    bank_account_number: 'Bank Account Number',
    account: 'Account',
    // Validation messages
    required_field: 'This field is required',
    invalid_email: 'Please enter a valid email',
    // Actions
    create: 'Create',
    update: 'Update',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    // Status messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
} as const;

export const tr = (key: keyof typeof vocab, params?: Record<string, string | number>): string => {
    let text: string = vocab[key];

    if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
            text = text.replace(`{{${paramKey}}}`, String(value));
        });
    }

    return text;
};

export const v = vocab;