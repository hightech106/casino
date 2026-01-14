"use strict";
/**
 * In-memory store implementation to replace Redis.
 * 
 * NOTE: This is a per-process in-memory store. For horizontal scaling,
 * a shared store (like Redis) would be required.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryStore = void 0;

// Main storage: Map<key, { value: any, expiresAt?: number }>
const store = new Map();

// Sets storage: Map<key, Set<member>>
const sets = new Map();

/**
 * Clean expired entries (lazy cleanup on access)
 */
function cleanupExpired(key) {
    const entry = store.get(key);
    if (entry && entry.expiresAt && Date.now() > entry.expiresAt) {
        store.delete(key);
        return true;
    }
    return false;
}

/**
 * In-memory store implementation
 */
const inMemoryStore = {
    /**
     * Get value by key. Returns null if missing or expired.
     */
    async get(key) {
        if (cleanupExpired(key)) {
            return null;
        }
        const entry = store.get(key);
        if (!entry) {
            return null;
        }
        // Return the value directly (already stored as object/string)
        return entry.value;
    },

    /**
     * Set value with optional TTL (in seconds)
     */
    async set(key, value, ttlSeconds) {
        const expiresAt = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : undefined;
        store.set(key, { value, expiresAt });
    },

    /**
     * Delete key
     */
    async del(key) {
        store.delete(key);
        sets.delete(key);
    },

    /**
     * Check if key exists
     */
    async has(key) {
        if (cleanupExpired(key)) {
            return false;
        }
        return store.has(key);
    },

    /**
     * Increment value (best-effort atomic for single process)
     */
    async incr(key, by = 1, ttlSeconds) {
        const entry = store.get(key);
        let currentValue = 0;
        
        if (entry && !cleanupExpired(key)) {
            const numValue = Number(entry.value);
            if (!isNaN(numValue)) {
                currentValue = numValue;
            }
        }
        
        const newValue = currentValue + by;
        const expiresAt = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : entry?.expiresAt;
        store.set(key, { value: newValue, expiresAt });
        return newValue;
    },

    /**
     * Get all keys, optionally filtered by prefix
     */
    async keys(prefix) {
        const allKeys = Array.from(store.keys());
        // Clean expired keys
        allKeys.forEach(key => cleanupExpired(key));
        
        if (!prefix) {
            return Array.from(store.keys());
        }
        
        return Array.from(store.keys()).filter(key => key.startsWith(prefix));
    },

    /**
     * Set operations - sMembers: Get all members of a set
     */
    async sMembers(key) {
        // Check if set has expired
        const setExpiryKey = `__set_expiry:${key}`;
        const expiryEntry = store.get(setExpiryKey);
        if (expiryEntry && expiryEntry.expiresAt && Date.now() > expiryEntry.expiresAt) {
            sets.delete(key);
            store.delete(setExpiryKey);
            return [];
        }
        const set = sets.get(key);
        if (!set) {
            return [];
        }
        return Array.from(set);
    },

    /**
     * Set operations - sAdd: Add member(s) to a set
     */
    async sAdd(key, ...members) {
        if (!sets.has(key)) {
            sets.set(key, new Set());
        }
        const set = sets.get(key);
        members.forEach(member => {
            if (Array.isArray(member)) {
                member.forEach(m => set.add(String(m)));
            } else {
                set.add(String(member));
            }
        });
        return members.length;
    },

    /**
     * Set operations - sRem: Remove member(s) from a set
     */
    async sRem(key, ...members) {
        const set = sets.get(key);
        if (!set) {
            return 0;
        }
        let removed = 0;
        members.forEach(member => {
            if (set.delete(String(member))) {
                removed++;
            }
        });
        if (set.size === 0) {
            sets.delete(key);
        }
        return removed;
    },

    /**
     * Set expiration on a key (for sets and regular keys)
     */
    async expire(key, ttlSeconds) {
        const entry = store.get(key);
        if (entry) {
            entry.expiresAt = Date.now() + (ttlSeconds * 1000);
            store.set(key, entry);
        }
        // Also handle sets - store expiration info separately
        if (sets.has(key)) {
            const setExpiryKey = `__set_expiry:${key}`;
            store.set(setExpiryKey, {
                value: true,
                expiresAt: Date.now() + (ttlSeconds * 1000)
            });
        }
    },

    /**
     * Health check (replaces ping)
     */
    async ping() {
        return 'PONG';
    },

    /**
     * Get TTL in seconds (-1 if no expiry, -2 if key doesn't exist)
     */
    async ttl(key) {
        const entry = store.get(key);
        if (!entry) {
            return -2;
        }
        if (!entry.expiresAt) {
            return -1;
        }
        const remaining = Math.ceil((entry.expiresAt - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }
};

exports.inMemoryStore = inMemoryStore;

