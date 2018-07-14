 
 const  uuid = require ('uuid/v1');
 const AWS = require('aws-sdk');
 const keys = require('../config/keys');
 const requireLogin = require('../middlewares/requireLogin')
 const s3 = new AWS.S3({
     accessKeyId: keys.accessKeyId,
     secretAccessKey:keys.secretAccessKey,
      });
module.exports = app => {
    //express behaviour to go to check for the middelware to authenticate if a user is loged in or not
app.get('/api/upload',requireLogin,(req,res) => {
    //unique key for a specific person uuid
const key =`${req.user.id}/${uuid()}.jpeg`;  
s3.getSignedUrl('putObject',{
Bucket:'my-blog-bucket-333',
ContentType: 'image/jpeg',
Key: key
},( err, url) => res.send({ key , url})
);
});

};