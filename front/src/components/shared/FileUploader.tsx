import { useCallback, useRef, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";
import Cropper from "react-cropper";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const cropperRef = useRef<Cropper>(null);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setImageToCrop(acceptedFiles[0]);
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const handleCrop = () => {
    if (cropperRef.current) {
      const image = cropperRef.current.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          setCroppedImage(blob);
          setImageToCrop(null); // Clear the imageToCrop state
          const newFile = new File([blob], imageToCrop.name, { type: blob.type });
          fieldChange([newFile]); // Update with the cropped file
          setFileUrl(URL.createObjectURL(newFile)); 
        }
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-light-2 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {пше  ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">
            Клацніть або перетягніть фото, щоб замінити
          </p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="base-medium text-[#313131] mb-2 mt-6">
            Перетягніть фото сюди
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button type="button" className="shad-button_dark_4">
            Обрати з комп'ютера
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
