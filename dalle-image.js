
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();


var image = require('./image.js');


async function createImageEdit (imageFile, maskFile, caption) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const fs = require("fs");

  // const resizedImage = await sharp(imageFile).resize(1024, 1024).png().toBuffer();
  // const resizedMask = await sharp(maskFile).resize(1024, 1024).png().toBuffer();

  try {
    const response = await openai.createImageEdit(
      fs.createReadStream(imageFile),
      fs.createReadStream(maskFile),
      caption,
      1, //number of images generated - hopefully we can get user to pick the best one
      "1024x1024"
    );
    console.log(response.data.data[0].url);
    image.getImageUrl(response.data.data[0].url, "test.png");
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}



const imageFile = "test_images/img1.png";
const maskFile = "test_images/img2.png";
const caption = "Bike rack.";


createImageEdit(imageFile, maskFile, caption)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });



