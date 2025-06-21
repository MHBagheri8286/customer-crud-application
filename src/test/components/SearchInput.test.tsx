import { SearchInput, type SearchInputProps } from '@components/SearchInput';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the debounce utility
vi.mock('@utils/Util', () => ({
    debounce: vi.fn((fn, delay) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: unknown[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }),
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('SearchInput', () => {
    const defaultProps: SearchInputProps = {
        onResults: vi.fn(),
        onError: vi.fn(),
        searchUrl: 'https://api.example.com/search',
        debounce: 300,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    //   describe('Rendering', () => {
    //     it('renders search input with placeholder', () => {
    //       render(<SearchInput {...defaultProps} />);

    //       const input = screen.getByPlaceholderText('...Search');
    //       expect(input).toBeInTheDocument();
    //       expect(input).not.toBeDisabled();
    //     });

    //     it('does not show loading or error initially', () => {
    //       render(<SearchInput {...defaultProps} />);

    //       expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    //       expect(screen.queryByText(/An Error occurred/)).not.toBeInTheDocument();
    //     });
    //   });

    //   describe('Loading State', () => {
    //     it('shows loading state during search', async () => {
    //       mockFetch.mockImplementation(() => 
    //         new Promise(resolve => setTimeout(() => resolve({
    //           ok: true,
    //           json: () => Promise.resolve([])
    //         }), 1000))
    //       );

    //       render(<SearchInput {...defaultProps} />);
    //       const input = screen.getByPlaceholderText('...Search');

    //       fireEvent.change(input, { target: { value: 'test query' } });
    //       vi.advanceTimersByTime(300); // advance past debounce delay

    //       await waitFor(() => {
    //         expect(screen.getByText('Loading...')).toBeInTheDocument();
    //       });

    //       expect(input).toBeDisabled();
    //     });

    //     it('hides loading state after successful search', async () => {
    //       const mockResults = [{ id: 1, name: 'result' }];
    //       mockFetch.mockResolvedValueOnce({
    //         ok: true,
    //         json: () => Promise.resolve(mockResults),
    //       });

    //       render(<SearchInput {...defaultProps} />);
    //       const input = screen.getByPlaceholderText('...Search');

    //       fireEvent.change(input, { target: { value: 'test' } });
    //       vi.advanceTimersByTime(300);

    //       await waitFor(() => {
    //         expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    //       });

    //       expect(input).not.toBeDisabled();
    //     });
    //   });

    describe('Search Functionality', () => {
        it('calls onResults with search results on successful search', async () => {
            const mockResults = [{ id: 1, name: 'test result' }];
            const onResults = vi.fn();

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResults),
            });

            render(<SearchInput {...defaultProps} onResults={onResults} />);
            const input = screen.getByPlaceholderText('...Search');

            await userEvent.type(input, 'app')

            vi.advanceTimersByTime(300);
            await waitFor(() => {
                expect(onResults).toHaveBeenCalledWith(mockResults);
            }, { timeout: 1000 });
        });

        // it('constructs correct search URL with encoded query', async () => {
        //   mockFetch.mockResolvedValueOnce({
        //     ok: true,
        //     json: () => Promise.resolve([]),
        //   });

        //   render(<SearchInput {...defaultProps} />);
        //   const input = screen.getByPlaceholderText('...Search');

        //   fireEvent.change(input, { target: { value: 'test with spaces & symbols' } });
        //   vi.advanceTimersByTime(300);

        //   await waitFor(() => {
        //     expect(mockFetch).toHaveBeenCalledWith(
        //       'https://api.example.com/search?q=test%20with%20spaces%20%26%20symbols',
        //       expect.objectContaining({
        //         signal: expect.any(AbortSignal),
        //       })
        //     );
        //   });
        // });

        // it('debounces search requests', async () => {
        //   mockFetch.mockResolvedValue({
        //     ok: true,
        //     json: () => Promise.resolve([]),
        //   });

        //   render(<SearchInput {...defaultProps} debounce={500} />);
        //   const input = screen.getByPlaceholderText('...Search');

        //   // Type multiple characters quickly
        //   fireEvent.change(input, { target: { value: 't' } });
        //   fireEvent.change(input, { target: { value: 'te' } });
        //   fireEvent.change(input, { target: { value: 'tes' } });
        //   fireEvent.change(input, { target: { value: 'test' } });

        //   // Advance time but not past debounce delay
        //   vi.advanceTimersByTime(400);
        //   expect(mockFetch).not.toHaveBeenCalled();

        //   // Advance past debounce delay
        //   vi.advanceTimersByTime(100);

        //   await waitFor(() => {
        //     expect(mockFetch).toHaveBeenCalledTimes(1);
        //   });
        // });

        // it('does not search for empty or whitespace-only queries', async () => {
        //   render(<SearchInput {...defaultProps} />);
        //   const input = screen.getByPlaceholderText('...Search');

        //   fireEvent.change(input, { target: { value: '   ' } });
        //   vi.advanceTimersByTime(300);

        //   await vi.runAllTimersAsync();
        //   expect(mockFetch).not.toHaveBeenCalled();
        // });
    });


});