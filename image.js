const AWS = require('aws-sdk');

var bucketName = process.env.BUCKET_NAME;
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_ACCESS_KEY;

AWS.config.update( {
   accessKeyId: AWS_ACCESS_KEY_ID,
   secretAccessKey: AWS_SECRET_ACCESS_KEY,
   region: 'us-east-2',
   deploy: true,
   domain: bucketName
})
var fs = require('fs');
const { builtinModules } = require('module');
let filepath = "meme.jpg";

const s3BucKet = new AWS.S3({params: { Bucket: 'codefest2023'}})
const s3Url = 'https://codefest2023.s3.amazonaws.com/'

const imageUpload = (path, content) => {
   const data = {
       Key: path,
       Body: content,
       ContentType: 'image/jpeg'
   }
   return new Promise((resolve, reject) => {
       s3BucKet.putObject(data, (err) => {
           if (err) {
               reject(err)
           }
           else {
               resolve(s3Url + path)
           }
       })
   })
}


exports.getImageUrl = async (input_file, output_file) => {
//    const buffer = getImgBuffer(base64Image);
    const content = fs.readFileSync(input_file);
    return imageUpload(output_file, content)
}


