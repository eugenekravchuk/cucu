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

  const updateImage = (imgSrc) => {
    fieldChange([imgSrc]);
    setFileUrl(convertFileToUrl(imgSrc));
    setFile(imgSrc);
  };

  useEffect(() => {
    if (file.length > 0) {
      fieldChange(file);
    } else {
      setFileUrl(mediaUrl);
      fieldChange([]);
    }
  }, [modalOpen]);

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
