const redis = require('redis');

class RedisService{
    constructor(){
        this.client=null;
        this.isConnected=false;
    }

   async connect(){
    try{
        this.client=redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        })
        this.client.on('error',(err)=>{
            console.error('Redis Client Error',err);
            this.isConnected=false;
        })
        this.client.on('connect',()=>{
            console.log('Connected to Redis');
            this.isConnected=true;
        })
        await this.client.connect()

    }
    catch(err){
         console.error('❌ Redis connection failed:', err);
         this.isConnected = false;
    }
}
    async get(key){
        try{
            if(!this.isConnected) return null
            const value=await this.client.get(key);
            return value?JSON.parse(value) : null
        }
        catch(err){
            console.log('Redist got error in fetching key',err)
            return null
        }
    }

    async set(key,value,expirationInSeconds=3600){
        try {
            if(!this.isConnected) return false
            await this.client.setEx(key,expirationInSeconds,JSON.stringify(value))
            return true
        } catch (error) {
            console.log('Redis failed in Setting',err);
            return false
            
        }
    }

    async delete(key){
        try {
            if(!this.isConnected) return false
            await this.client.del(key)
            return true

        } catch (error) {
            console.log('Redis failed in Deleting',err);
            return false
        }
    }

    async clear(){
        try {
            if(!this.isConnected) return false
            await this.client.flushAll()
            return true
        } catch (error) {
            console.log('Redis failed in Clearing',err);
            return false
        }
    }
}

module.exports = new RedisService();