import React, { useRef, useState } from "react";
import { saveAs } from 'file-saver'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'


function UploadButton({setImageSource}) {
    const [file, setFile] = useState();
    const [crop, setCrop] = useState({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        aspect: 1
      });
    const [newCrop, setNewCrop] = useState({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        aspect: 1
    });
    const [croppedFile, setCroppedFile] = useState({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });
    const [maskedFile, setMaskedFile] = useState();

    function handleChange(e) {
      console.log(URL.createObjectURL(e.target.files[0]))
        setFile(URL.createObjectURL(e.target.files[0]));
        setImageSource(e.target.files[0]);
    };

    async function makeClientCrop(crop) {
        if (file && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
            file,
            crop,
            'newImage.png'
          );
        }
    }

    async function makeClientMask(newCrop) {
      if (croppedFile && newCrop.width && newCrop.height) {
          const maskedImageUrl = await getMaskedImg(
          croppedFile,
          newCrop,
          'newMaskedImage.png'
        );
      }
    }

    async function getMaskedImg(image, newCrop, fileName) {
        var img = new Image();
        img.src =  image;
        img.onload = function() {

          const canvas = document.createElement('canvas');
          const pixelRatio = window.devicePixelRatio;
      
          const scaleX = img.naturalWidth / img.width;
          const scaleY = img.naturalHeight / img.height;
          const ctx = canvas.getContext('2d');
      
          canvas.width = newCrop.width;
          canvas.height = newCrop.height;
          // canvas.width = crop.width;
          // canvas.height = crop.height;
          

          // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = 'high';
      
          ctx.drawImage(
              img,
              0, 
              0,
              canvas.width,
              canvas.height
          );          
          
          ctx.clearRect(newCrop.x, newCrop.y, newCrop.width, newCrop.height);
          
          return new Promise((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  //reject(new Error('Canvas is empty'));
                  console.error('Canvas is empty');
                  return;
                }
              // console.log(blob);
              // console.log(URL.createObjectURL(blob));
              setMaskedFile(URL.createObjectURL(blob))
              },
              'image/png',
              1
            );
          });
        }
      }

      async function getCroppedImg(image, crop, fileName) {
        var img = new Image();
        img.src =  image;
        img.onload = function() {
          const canvas1 = document.createElement('canvas');
          const pixelRatio = window.devicePixelRatio;
      
          const scaleX = img.naturalWidth / img.width;
          const scaleY = img.naturalHeight / img.height;
          const ctx1 = canvas1.getContext('2d');
      
          // canvas1.width = crop.width * pixelRatio * scaleX;
          // canvas1.height = crop.height * pixelRatio * scaleY;
          canvas1.width = img.width;
          canvas1.height = img.height;

          // ctx1.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx1.imageSmoothingQuality = 'high';
      
          // ctx1.drawImage(
          //     img,
          //     crop.x * scaleX,
          //     crop.y * scaleY,
          //     crop.width * scaleX,
          //     crop.height * scaleY,
          //     0,
          //     0,
          //     crop.width * scaleX,
          //     crop.height * scaleY
          // );
        //   ctx1.drawImage(
        //     img,
        //     crop.x,
        //     crop.y,
        //     crop.width,
        //     crop.height,
        //     0,
        //     0,
        //     crop.width,
        //     crop.height
        // );
        ctx1.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0, 
          0,
          crop.width,
          crop.height
      );

          
          
          
          
          return new Promise((resolve, reject) => {
            canvas1.toBlob(
              (blob) => {
                if (!blob) {
                  //reject(new Error('Canvas is empty'));
                  console.error('Canvas is empty');
                  return;
                }
              // console.log(blob);
              // console.log(URL.createObjectURL(blob));
              setCroppedFile(URL.createObjectURL(blob))
              },
              'image/png',
              1
            );
          });
        }
      }

    return (
        <div>
        <form action="/action_page.php">
            <input type="file" id="myFile" name="filename" onChange={handleChange} />
        </form>
        {file && (<ReactCrop aspect={1} crop={crop} onChange={c => setCrop(c)} onComplete={makeClientCrop}>
            <img src={file} />
        </ReactCrop>)}
        {croppedFile && (
            <ReactCrop crop={newCrop} onChange={c => setNewCrop(c)} onComplete={makeClientMask}>
                <img src={croppedFile} />
            </ReactCrop>
        )}
        {maskedFile && (<img src={maskedFile} />)}
        </div>
    );
};

export default UploadButton;