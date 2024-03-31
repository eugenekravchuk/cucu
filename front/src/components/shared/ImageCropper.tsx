import { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../setCanvasPreview";
import saveAs from "file-saver";

const MIN_DIMENSION = 150;

const ImageCropper = ({
  closeModal,
  updateAvatar,
  uploadedImage,
  aspectRatio,
  isCircular,
}) => {
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(uploadedImage);
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState("");

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthInPercent },
      aspectRatio,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(crop);
  };

  return (
    <>
      {imgSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            keepSelection
            circularCrop={isCircular}
            aspect={aspectRatio}
            minWidth={MIN_DIMENSION}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}>
            <img
              ref={imageRef}
              src={imgSrc}
              alt=""
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-gray-700 hover:bg-gray-800"
            onClick={() => {
              setCanvasPreview(
                imageRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(
                  crop,
                  imageRef.current.width,
                  imageRef.current.height
                )
              );
              previewCanvasRef.current.toBlob(function (blob) {
                const file = new File([blob], "preview.png", {
                  type: "image/png",
                });
                updateAvatar(file);
              }, "image/png");

              closeModal();
            }}>
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}></canvas>
      )}
    </>
  );
};
export default ImageCropper;
