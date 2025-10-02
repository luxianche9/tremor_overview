/**
 * SessionStorage utility for managing application data
 * Provides type-safe CRUD operations with JSON serialization
 */

const STORAGE_KEYS = {
  AGENTS: "tremor_agents",
  TICKETS: "tremor_tickets",
} as const

export type StorageKey = keyof typeof STORAGE_KEYS

/**
 * Get data from sessionStorage
 */
export function getStorageData<T>(key: StorageKey): T | null {
  if (typeof window === "undefined") return null

  try {
    const item = sessionStorage.getItem(STORAGE_KEYS[key])
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error)
    return null
  }
}

/**
 * Set data to sessionStorage
 */
export function setStorageData<T>(key: StorageKey, data: T): void {
  if (typeof window === "undefined") return

  try {
    sessionStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data))
  } catch (error) {
    console.error(`Error writing to sessionStorage (${key}):`, error)
  }
}

/**
 * Remove data from sessionStorage
 */
export function removeStorageData(key: StorageKey): void {
  if (typeof window === "undefined") return

  try {
    sessionStorage.removeItem(STORAGE_KEYS[key])
  } catch (error) {
    console.error(`Error removing from sessionStorage (${key}):`, error)
  }
}

/**
 * Clear all app data from sessionStorage
 */
export function clearAllStorage(): void {
  if (typeof window === "undefined") return

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error clearing sessionStorage:", error)
  }
}

/**
 * Initialize storage with default data if empty
 */
export function initializeStorage<T>(
  key: StorageKey,
  defaultData: T,
): T {
  const existing = getStorageData<T>(key)

  if (!existing) {
    setStorageData(key, defaultData)
    return defaultData
  }

  return existing
}
