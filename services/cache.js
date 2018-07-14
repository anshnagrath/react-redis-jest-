const mongoose = require ('mongoose');
const redis = require ('redis');
const util = require ('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
//to convert it into a a promisse as client.hhget does not gives promise as a output
client.hget = util.promisify(client.hget);
//requiring the exec function from mogoose libraray
const exec = mongoose.Query.prototype.exec;
//to prevent caching of every Query   
// options are used to reducue the dependency on a paticular id (user Id)
mongoose.Query.prototype.cache  = function (options ={}) {

    this.useCache =true;
   // '' if someone does not pass a key 
    this.hashKey = JSON.stringify(options.key || '');
    //to make it chainable
    return this;
}






mongoose.Query.prototype.exec =async function () {
if (!this.useCache){
    return exec.apply(this,arguments)
}
    // this refers to the query being executed
        console.log(this.getQuery(),'hget query here');
        console.log(this.mongooseCollection.name,'name of mmongoose collection being used ')
    
        //to coppy values from one query of the database
           const key = JSON.stringify(Object.assign({},this.getQuery(),{
              collection: this.mongooseCollection.name  
            }));
            // the same exec function as of mongooose
            console.log(key,'keys created in cache')
            const cacheValue = await client.hget(this.hashKey,key);
       if(cacheValue){
         console.log('cache excicuted')
            //to check the model 
           // console.log(this)
            const doc =  JSON.parse(cacheValue);
            //to create a model instance
            return (Array.isArray(doc))?doc.map(d=> new this.model(d)):new this.model(doc)
         
            
    }
             //if not in the  cashed value we will send the query to mongoose
            const result = await exec.apply(this,arguments);  
            // Ex is to persist the key for particular period of time 
            client.hset(this.hashKey,key, JSON.stringify(result),'EX',10)
            console.log("new Query ececuted")
            return result;
}
module.exports ={
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}