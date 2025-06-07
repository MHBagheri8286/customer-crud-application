// customerValidationService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  validatePhoneNumber, 
  validateEmail, 
  validateBankAccountNumber,
  createCustomerValidationService 
} from '../../domain/services/customer/CustomerValidationService';

// Mock google-libphonenumber
vi.mock('google-libphonenumber', () => {
  const mockPhoneUtil = {
    parse: vi.fn(),
    isValidNumber: vi.fn(),
    getNumberType: vi.fn(),
  };

  return {
    PhoneNumberUtil: {
      getInstance: () => mockPhoneUtil,
    },
    PhoneNumberType: {
      MOBILE: 1,
      FIXED_LINE_OR_MOBILE: 4,
      FIXED_LINE: 0,
      UNKNOWN: -1,
    },
  };
});

import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber';

interface MockPhoneUtil {
  parse: ReturnType<typeof vi.fn>;
  isValidNumber: ReturnType<typeof vi.fn>;
  getNumberType: ReturnType<typeof vi.fn>;
}

const mockPhoneUtil = PhoneNumberUtil.getInstance() as unknown as MockPhoneUtil;

describe('Customer Validation Service', () => {
  
  describe('validatePhoneNumber', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return true for valid mobile number', () => {
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.MOBILE);

      const result = validatePhoneNumber('+1234567890');

      expect(result).toBe(true);
      expect(mockPhoneUtil.parse).toHaveBeenCalledWith('+1234567890');
      expect(mockPhoneUtil.isValidNumber).toHaveBeenCalledWith(mockParsedNumber);
      expect(mockPhoneUtil.getNumberType).toHaveBeenCalledWith(mockParsedNumber);
    });

    it('should return true for valid fixed line or mobile number', () => {
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.FIXED_LINE_OR_MOBILE);

      const result = validatePhoneNumber('+1234567890');

      expect(result).toBe(true);
    });

    it('should return false for invalid number', () => {
      const mockParsedNumber = { country: 'US', nationalNumber: '123' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(false);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.MOBILE);

      const result = validatePhoneNumber('123');

      expect(result).toBe(false);
    });

    it('should return false for fixed line number', () => {
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.FIXED_LINE);

      const result = validatePhoneNumber('+1234567890');

      expect(result).toBe(false);
    });

    it('should return false for unknown number type', () => {
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.UNKNOWN);

      const result = validatePhoneNumber('+1234567890');

      expect(result).toBe(false);
    });

    it('should handle parsing errors gracefully', () => {
      mockPhoneUtil.parse.mockImplementation(() => {
        throw new Error('Invalid phone number format');
      });

      expect(() => validatePhoneNumber('invalid')).toThrow('Invalid phone number format');
    });
  });

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
        'user123@test-domain.net',
        'a@b.co',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        '',
        'plainaddress',
        '@missingusername.com',
        'username@.com',
        'username@com',
        'username..double.dot@example.com',
        'username@-example.com',
        'username @example.com',
        'username@ example.com',
        'user@',
        'user@domain',
        'user name@example.com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validateBankAccountNumber', () => {
    it('should return true for valid bank account numbers', () => {
      const validAccountNumbers = [
        '1234567890',
        '123456789012345',
        '1234 5678 9012',
        '12 34 56 78 90',
        '000000001', // account number with leading zeros
      ];

      validAccountNumbers.forEach(accountNumber => {
        expect(validateBankAccountNumber(accountNumber)).toBe(true);
      });
    });

    it('should return false for invalid bank account numbers', () => {
      const invalidAccountNumbers = [
        '',
        '   ', // only whitespace
         'abc123456', // contains letters
        '123-abc-456', // contains letters with dashes
         '123 abc 456', // contains letters with spaces
        '123!456', // contains special characters
         '12.34.56', // contains dots
        '12/34/56', // contains slashes
         'ABCDEFGH', // only letters
         '123-', // ends with dash
        // '-123', // starts with dash
      ];

      invalidAccountNumbers.forEach(accountNumber => {
        expect(validateBankAccountNumber(accountNumber)).toBe(false);
      });
    });

    it('should handle null and undefined inputs', () => {
      expect(validateBankAccountNumber(null as unknown as string)).toBe(false);
      expect(validateBankAccountNumber(undefined as unknown as string)).toBe(false);
    });
  });

  describe('createCustomerValidationService', () => {
    it('should return a service with all validation methods', () => {
      const service = createCustomerValidationService();

      expect(service).toHaveProperty('validatePhoneNumber');
      expect(service).toHaveProperty('validateEmail');
      expect(service).toHaveProperty('validateBankAccountNumber');
      expect(typeof service.validatePhoneNumber).toBe('function');
      expect(typeof service.validateEmail).toBe('function');
      expect(typeof service.validateBankAccountNumber).toBe('function');
    });

    it('should work with the service interface', () => {
      const service = createCustomerValidationService();

      // Mock the phone util for this test
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.MOBILE);

      expect(service.validatePhoneNumber('+1234567890')).toBe(true);
      expect(service.validateEmail('test@example.com')).toBe(true);
      expect(service.validateBankAccountNumber('1234567890')).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should validate a complete customer data set', () => {
      const service = createCustomerValidationService();
      
      // Mock valid phone number
      const mockParsedNumber = { country: 'US', nationalNumber: '1234567890' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(true);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.MOBILE);

      const customerData = {
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        bankAccountNumber: '1234-5678-9012',
      };

      expect(service.validateEmail(customerData.email)).toBe(true);
      expect(service.validatePhoneNumber(customerData.phoneNumber)).toBe(true);
      expect(service.validateBankAccountNumber(customerData.bankAccountNumber)).toBe(false);
    });

    it('should reject invalid customer data set', () => {
      const service = createCustomerValidationService();
      
      const mockParsedNumber = { country: 'US', nationalNumber: '123' };
      mockPhoneUtil.parse.mockReturnValue(mockParsedNumber);
      mockPhoneUtil.isValidNumber.mockReturnValue(false);
      mockPhoneUtil.getNumberType.mockReturnValue(PhoneNumberType.UNKNOWN);

      const invalidCustomerData = {
        email: 'invalid-email',
        phoneNumber: '123',
        bankAccountNumber: 'abc123',
      };

      expect(service.validateEmail(invalidCustomerData.email)).toBe(false);
      expect(service.validatePhoneNumber(invalidCustomerData.phoneNumber)).toBe(false);
      expect(service.validateBankAccountNumber(invalidCustomerData.bankAccountNumber)).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings for email validation', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      expect(validateEmail(longEmail)).toBe(true);
    });

    it('should handle very long bank account numbers', () => {
      const longAccountNumber = '1'.repeat(50);
      expect(validateBankAccountNumber(longAccountNumber)).toBe(true);
    });

    it('should handle bank account with only spaces', () => {
      expect(validateBankAccountNumber('- - - -')).toBe(false);
      expect(validateBankAccountNumber('    ')).toBe(false);
      expect(validateBankAccountNumber('----')).toBe(false);
    });

    it('should handle mixed valid characters in bank account', () => {
      expect(validateBankAccountNumber('12-34 56-78')).toBe(false);
      expect(validateBankAccountNumber('  12-34-56  ')).toBe(false);
    });
  });
});