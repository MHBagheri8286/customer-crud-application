import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@components/Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button text="Click me" />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button text="Click me" onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button text="Click me" disabled />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when loading is true', () => {
    render(<Button text="Click me" loading />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render with primary variant by default', () => {
    render(<Button text="Click me" />);
    
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('should render with secondary variant', () => {
    render(<Button text="Click me" variant="secondary" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-300', 'text-gray-700');
  });

  it('should render with correct button type', () => {
    render(<Button text="Submit" type="submit" />);
    
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should apply fullWidth class', () => {
    render(<Button text="Click me" fullWidth />);
    
    expect(screen.getByRole('button')).toHaveClass('flex-1');
  });

  it('should apply custom className', () => {
    render(<Button text="Click me" className="custom-class" />);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});