const AWS = require('aws-sdk');
const axios = require('axios');

const bucketName = process.env.BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_ACCESS_KEY;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
  deploy: true,
  domain: bucketName,
});

const s3Bucket = new AWS.S3({ params: { Bucket: 'codefest2023' } });
const s3Url = 'https://codefest2023.s3.amazonaws.com/';

const imageUpload = (path, content) => {
  const data = {
    Key: path,
    Body: content,
    ContentType: 'image/jpeg',
  };
  return new Promise((resolve, reject) => {
    s3Bucket.putObject(data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(s3Url + path);
      }
    });
  });
};

exports.getImageUrl = async (input_file, output_file) => {
  try {
    const response = await axios.get(input_file, { responseType: 'arraybuffer' });
    const content = response.data;
    return imageUpload(output_file, content);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to upload image');
  }
};
