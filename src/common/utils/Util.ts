export function nameof<TObject>(key: keyof TObject): keyof TObject;
export function nameof<TObject>(obj: TObject, key: keyof TObject): keyof TObject;
export function nameof(key1: unknown, key2?: unknown): unknown {
    return key2 ?? key1;
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}