"use strict";
/**
 * Module providing cache functionality using in-memory store.
 * NOTE: In-memory store is per-process; horizontal scaling requires shared store.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.delFromCache = exports.getFromCache = exports.setToCache = exports.redisClient = void 0;

const inMemoryStore_1 = require("../lib/inMemoryStore");
require('dotenv').config();

// Create a redisClient-like object that wraps the in-memory store
// This maintains API compatibility with existing code
const redisClient = {
    // Set operations
    async sMembers(key) {
        return await inMemoryStore_1.inMemoryStore.sMembers(key);
    },
    async sAdd(key, ...members) {
        return await inMemoryStore_1.inMemoryStore.sAdd(key, ...members);
    },
    async sRem(key, ...members) {
        return await inMemoryStore_1.inMemoryStore.sRem(key, ...members);
    },
    // Expiration
    async expire(key, ttlSeconds) {
        return await inMemoryStore_1.inMemoryStore.expire(key, ttlSeconds);
    },
    // Health check
    async ping() {
        return await inMemoryStore_1.inMemoryStore.ping();
    },
    // Direct get/set/del for compatibility
    async get(key) {
        return await inMemoryStore_1.inMemoryStore.get(key);
    },
    async set(key, value) {
        return await inMemoryStore_1.inMemoryStore.set(key, value);
    },
    async del(key) {
        return await inMemoryStore_1.inMemoryStore.del(key);
    },
    async setEx(key, ttlSeconds, value) {
        return await inMemoryStore_1.inMemoryStore.set(key, value, ttlSeconds);
    }
};

exports.redisClient = redisClient;

async function setToCache(key, value, ttl = 3600) {
    try {
        // Store value directly (can be object or string)
        await inMemoryStore_1.inMemoryStore.set(key, value, ttl);
        console.log(`Cache set for key: ${key}`);
    } catch (error) {
        console.error(`Error setting cache for key ${key}:`, error);
    }
}
exports.setToCache = setToCache;

async function getFromCache(key) {
    try {
        const data = await inMemoryStore_1.inMemoryStore.get(key);
        if (data !== null) {
            console.log(`Cache hit for key: ${key}`);
            return data; // Already stored as object/string, no need to parse
        }
        console.log(`Cache miss for key: ${key}`);
        return null;
    } catch (error) {
        console.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
}
exports.getFromCache = getFromCache;

async function delFromCache(key) {
    try {
        await inMemoryStore_1.inMemoryStore.del(key);
        console.log(`Cache deleted for key: ${key}`);
    } catch (error) {
        console.error(`Error deleting cache for key ${key}:`, error);
    }
}
exports.delFromCache = delFromCache;