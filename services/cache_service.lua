local CacheService = {}
local cache = {}
local cache_expiry = {}

-- Function to set a cache entry with an expiration time
function CacheService.set(key, value, ttl)
    cache[key] = value
    cache_expiry[key] = os.time() + ttl
end

-- Function to get a cache entry if it hasn't expired
function CacheService.get(key)
    if cache[key] and cache_expiry[key] > os.time() then
        return cache[key]
    else
        cache[key] = nil
        cache_expiry[key] = nil
        return nil
    end
end

-- Function to clear the cache
function CacheService.clear()
    cache = {}
    cache_expiry = {}
end

return CacheService
