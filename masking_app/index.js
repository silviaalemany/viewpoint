const express = require('express');
const multer = require('multer');
const canvas = require('canvas');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), (req, res) => {
  const { width, height } = req.body;
  const { x, y, w, h } = req.body.region;

  const image = new canvas.Image();
  const canvas = canvas.createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  image.onload = () => {
    ctx.drawImage(image, 0, 0);

    // Create a new transparent rectangle in the selected region
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(x, y, w, h);

    // Save the modified image
    canvas.toDataURL('image/png', (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  };

  image.src = req.file.path;
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});