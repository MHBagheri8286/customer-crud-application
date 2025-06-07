import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber';

export interface CustomerValidationService {
    validatePhoneNumber(phoneNumber: string): boolean;
    validateEmail(email: string): boolean;
    validateBankAccountNumber(accountNumber: string): boolean;
  }

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  try {
    const parsedNumber = phoneUtil.parse(phoneNumber);
    const numberType = phoneUtil.getNumberType(parsedNumber);
    return (
      phoneUtil.isValidNumber(parsedNumber) &&
      (numberType === PhoneNumberType.MOBILE || 
       numberType === PhoneNumberType.FIXED_LINE_OR_MOBILE)
    );
  } catch {
    throw new Error('Invalid phone number format');
  }
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const [localPart, domain] = email.split('@');
  return !localPart.includes('..') &&
         !localPart.startsWith('.') &&
         !localPart.endsWith('.') &&
         !domain.startsWith('-') &&
         !domain.endsWith('-') &&
         !domain.includes('..');
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

export const createCustomerValidationService = (): CustomerValidationService => ({
  validatePhoneNumber,
  validateEmail,
  validateBankAccountNumber,
});