import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { saveAs } from "file-saver";

function ImageEditor({ imageSrc }) {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    aspect: 1 / 1,
  });
  const [croppedImageSrc, setCroppedImageSrc] = useState(null);

  function onCropChange(crop) {
    setCrop(crop);
  }

  function onImageLoaded(image) {
    setCrop({
      unit: "%",
      width: 50,
      aspect: image.width / image.height,
    });
  }

  function onCropComplete(crop, pixelCrop) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob((blob) => {
        saveAs(blob, "cropped-image.png");
        setCroppedImageSrc(URL.createObjectURL(blob));
      });
    };
  }

  return (
    <div>
      <ReactCrop
        src={imageSrc}
        crop={crop}
        onChange={onCropChange}
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
      />
      {croppedImageSrc && (
        <div>
          <h3>Cropped Image</h3>
          <img src={croppedImageSrc} alt="Cropped" />
        </div>
      )}
    </div>
  );
}

export default ImageEditor;