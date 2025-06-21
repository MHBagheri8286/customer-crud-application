import { useSearchInput } from "./UseSearchInput";

export interface SearchInputProps<T = unknown> {
    onResults: (value: T[]) => void;
    onError?: (err: Error) => void;
    debounce?: number;
    searchUrl: string;
}


export function SearchInput<T = unknown>(props: SearchInputProps<T>) {
    const { error, isLoading, changeHandler } = useSearchInput<T>(props);

    return (
        <div className="search-input">
            <input
                onChange={changeHandler}
                placeholder="...Search"
                disabled={isLoading}
            />
            {isLoading && <div className="loading">
                Loading...
            </div>}
            {error && <div className="loading">
                An Error occurred: {error}
            </div>}
        </div>
    )
}