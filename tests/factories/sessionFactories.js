
const Keygrip = require ('keygrip');
const keys = require('../../config/keys');
//using keygrip to mo
const keygrip  = new Keygrip([keys.cookieKey]);
module.exports = (user) =>{
    const sessionObject = {
        passport:{
             user : user._id.toString()
        }
    };
//Buffer.from(converting it into base64) to generated a session string
const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64')    
//to generate session sig   
const sig = keygrip.sign('session='+session);
return {session, sig}
}