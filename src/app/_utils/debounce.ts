type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): DebouncedFunction<T> => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export default debounce;
