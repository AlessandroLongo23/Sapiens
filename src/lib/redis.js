import Redis from 'ioredis';
import { config } from '$lib/config';

const redis = new Redis(config.redis.url);

redis.on('error', function(err) { 
	console.error('Redis error:', err); 
});

export const setSession = async (sid, val, ttl) => {
    if (val) {
        await redis.setex(sid, ttl || config.redis.ttl, JSON.stringify(val))
    } else {
        await redis.del(sid);
    }
};


export const getSession = async (sid) => {
    const val = await redis.get(sid);
    return JSON.parse(val);
}

export const updateTtl = async (sid) => {
    await redis.expire(sid, config.redis.ttl);
}

export default redis