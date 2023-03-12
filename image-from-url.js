const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
const s3 = new AWS.S3();
const uuidV4 = require('uuid');
const request = require('request');
const s3Bucket = new AWS.S3( { params: { Bucket: 'samus-original-bucket' } } )

request.get({
   method: 'GET',
   url: 'http://lorempixel.com/400/200/',
   encoding: null, // If null, the body is returned as a Buffer.
}, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = {
        Key: uuidV4(),
        Body: body,
        ContentType: response.headers['content-type']
      };
      s3Bucket.upload(data, (err, data) => {
        if (err) {
            console.log('Error uploading data: ', data);
          } else {
            console.log('succesfully uploaded the image!');
          }
      });
    }
});