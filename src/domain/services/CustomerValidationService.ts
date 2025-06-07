import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber';

export interface CustomerValidationService {
    validatePhoneNumber(phoneNumber: string): boolean;
    validateEmail(email: string): boolean;
    validateBankAccountNumber(accountNumber: string): boolean;
  }

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (phoneNumber: string): boolean => {
    const parsedNumber = phoneUtil.parse(phoneNumber);
    const numberType = phoneUtil.getNumberType(parsedNumber);
    return (
      phoneUtil.isValidNumber(parsedNumber) &&
      (numberType === PhoneNumberType.MOBILE || 
       numberType === PhoneNumberType.FIXED_LINE_OR_MOBILE)
    );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBankAccountNumber = (accountNumber: string): boolean => {
  // If empty or only whitespace, return false (validation fails)
  if (!accountNumber || accountNumber.trim() === '') {
    return false;
  }
  // Clean the account number (remove spaces and dashes)
  const cleanAccountNumber = accountNumber.replace(/[\s-]/g, '');
  // Check if it contains only digits
  return /^\d+$/.test(cleanAccountNumber);
};

export const createCustomerValidationService = (): CustomerValidationService => ({
  validatePhoneNumber,
  validateEmail,
  validateBankAccountNumber,
});