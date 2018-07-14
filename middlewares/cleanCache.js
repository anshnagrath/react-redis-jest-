const {clearHash} =  require('../services/cache');
module.exports = async (req,res,next) => {
   // As middleware is always excecuted first 
    await next();
    clearHash(req.user.id);
};