/**
 * Storage utility functions
 */

export const getFromStorage = <T = any>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

export const setInStorage = <T = any>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

export const clearStorage = (): void => {
  if (typeof window === "undefined") return;
  localStorage.clear();
};

export const getFromSessionStorage = <T = any>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};

export const setInSessionStorage = <T = any>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
};
