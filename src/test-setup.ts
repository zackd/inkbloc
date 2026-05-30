import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Node.js 22+ defines localStorage as undefined (requires --localstorage-file),
// preventing jsdom from overriding it. Provide a working mock instead.
const localStorageData: Record<string, string> = {};

vi.stubGlobal('localStorage', {
    getItem: (key: string) => localStorageData[key] ?? null,
    setItem: (key: string, value: string) => { localStorageData[key] = value; },
    removeItem: (key: string) => { delete localStorageData[key]; },
    clear: () => { Object.keys(localStorageData).forEach((k) => delete localStorageData[k]); },
    get length() { return Object.keys(localStorageData).length; },
    key: (index: number) => Object.keys(localStorageData)[index] ?? null,
});
