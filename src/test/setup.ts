import '@testing-library/jest-dom';
import { vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

vi.mock('@utils/Util', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
  nameof: vi.fn((key: string) => key)
}));