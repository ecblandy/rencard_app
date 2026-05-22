/**
 * Salva qualquer dado serializável no localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Recupera e tipa qualquer dado do localStorage
 */
export function getFromStorage<T>(key: string): T | null {
  const json = localStorage.getItem(key);
  return json ? (JSON.parse(json) as T) : null;
}

/**
 * Remove um item específico do localStorage
 */
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}
