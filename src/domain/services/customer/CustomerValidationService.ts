import { isValidPhoneNumber } from 'libphonenumber-js/min';
export interface CustomerValidationService {
  validatePhoneNumber(phoneNumber: string): boolean;
  validateEmail(email: string): boolean;
  validateBankAccountNumber(accountNumber: string): boolean;
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  try {
    return isValidPhoneNumber(phoneNumber);
  } catch {
    throw new Error('Invalid phone number format');
  }
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validateBankAccountNumber = (accountNumber: string): boolean => {
  // If empty or only whitespace, return false
  if (!accountNumber || accountNumber.trim() === '') {
    return false;
  }
  // Clean the account number (remove spaces and dashes)
  const cleanAccountNumber = accountNumber.replace(/[\s]/g, '');

  // Check if it contains only digits AND is not empty after cleaning
  return cleanAccountNumber.length > 0 && /^\d+$/.test(cleanAccountNumber);
};

export const createCustomerValidationService =
  (): CustomerValidationService => ({
    validatePhoneNumber,
    validateEmail,
    validateBankAccountNumber,
  });
