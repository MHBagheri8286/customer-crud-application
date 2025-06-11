import { Input } from '@components/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

interface TestFormData {
  username: string;
  email: string;
}

function TestWrapper({ children }: { children: (register: UseFormRegister<TestFormData>) => React.ReactNode }) {
  const { register } = useForm<TestFormData>();
  return <form>{children(register)}</form>;
}

describe('Input Component', () => {
  it('should render input with label', () => {
    render(
      <TestWrapper>
        {(register) => (
          <Input name="username" label="Username" register={register} />
        )}
      </TestWrapper>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should show required asterisk when required', () => {
    render(
      <TestWrapper>
        {(register) => (
          <Input name="username" label="Username" register={register} required />
        )}
      </TestWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should show error message', () => {
    const error = { type: 'required', message: 'Username is required' };

    render(
      <TestWrapper>
        {(register) => (
          <Input name="username" label="Username" register={register} error={error} />
        )}
      </TestWrapper>
    );

    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        {(register) => (
          <Input name="username" label="Username" register={register} disabled />
        )}
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        {(register) => (
          <Input name="username" label="Username" register={register} />
        )}
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'john');

    expect(input).toHaveValue('john');
  });

  it('should render with correct input type', () => {
    render(
      <TestWrapper>
        {(register) => (
          <Input name="email" label="Email" type="email" register={register} />
        )}
      </TestWrapper>
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });
});