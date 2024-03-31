import { useCallback, useEffect, useRef, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui";
import { convertFileToUrl } from "@/lib/utils";
import Modal from "./Modal";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [modalOpen, setModalOpen] = useState(false);
  const [getPhotoBack, setGetPhotoBack] = useState(false);

  const dataURIRegex =
    /^data:image\/(png|jpg|jpeg|gif|webp);base64,([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/i;

  function isBase64(str) {
    return dataURIRegex.test(str);
  }

  function base64ToFile(dataURI: string, filename: string): File {
    const [mimeType, base64Data] = dataURI.split(",", 2);
    if (!mimeType || !base64Data) {
      throw new Error("Invalid data URI format");
    }

    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }

  useEffect(() => {
    if (getPhotoBack && isBase64(fileUrl)) {
      console.log(base64ToFile(fileUrl, "profile.png"));
      fieldChange([base64ToFile(fileUrl, "profile.png")]);
    } else {
      setFileUrl("");
      fieldChange([]);
    }
  }, [getPhotoBack]);

  const updateImage = (imgSrc) => {
    setFileUrl(imgSrc);
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setGetPhotoBack(false);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
      setModalOpen(true);
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (modalOpen) return;

      setFileUrl(convertFileToUrl(acceptedFiles[0]));
      setModalOpen(true);
    },
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <>
      <div
        {...getRootProps({ disabled: modalOpen })}
        className="flex flex-center flex-col bg-light-2 rounded-xl cursor-pointer">
        <input
          {...getInputProps({ disabled: modalOpen })}
          className="cursor-pointer"
          disabled={modalOpen}
        />
        {fileUrl ? (
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
      {modalOpen && (
        <Modal
          updateAvatar={updateImage}
          closeModal={() => {
            setModalOpen(false);
            setGetPhotoBack(true);
          }}
          uploadedImage={fileUrl}
          aspectRatio={4 / 3}
        />
      )}
    </>
  );
};

export default FileUploader;
