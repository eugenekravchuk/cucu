import React, { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

const ImageCropper = () => {
  const [crop, setCrop] = useState<Crop>();
  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
      <img src="/assets/images/profile.png" />
    </ReactCrop>
  );
};

export default ImageCropper;
