import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";
import Modal from "./Modal";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [modalOpen, setModalOpen] = useState(false);
  const [getPhotoBack, setGetPhotoBack] = useState(false);

  interface Base64Data {
    mimeType: string;
    base64Data: string;
  }

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

  const updateImage = (imgSrc) => {
    setFileUrl(imgSrc);
  };

  useEffect(() => {
    if (getPhotoBack && isBase64(fileUrl)) {
      console.log(base64ToFile(fileUrl, "profile.png"));
      fieldChange([base64ToFile(fileUrl, "profile.png")]);
    } else {
      setFileUrl(mediaUrl);
      fieldChange([]);
    }
  }, [getPhotoBack]);

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
      <div {...getRootProps()}>
        <input {...getInputProps()} className="cursor-pointer" />

        <div className="cursor-pointer flex-center gap-4 bg-[#EDEDED] py-3 px-3 rounded-xl">
          <img
            src={fileUrl || "/assets/icons/profile-placeholder.svg"}
            alt="image"
            className="h-24 w-24 rounded-full object-cover object-top"
          />
          <p className="text-primary-500 font-bold large md:bbase-semibold">
            Завантажте фото
          </p>
        </div>
      </div>
      {modalOpen && (
        <Modal
          updateAvatar={updateImage}
          closeModal={() => {
            setModalOpen(false);
            setGetPhotoBack(true);
          }}
          uploadedImage={fileUrl}
          aspectRatio={1}
          isCircular={true}
        />
      )}
    </>
  );
};

export default ProfileUploader;
