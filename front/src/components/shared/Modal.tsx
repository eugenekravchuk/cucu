import CloseIcon from "./CloseIcon";
import ImageCropper from "./ImageCropper";

const Modal = ({
  updateAvatar,
  closeModal,
  uploadedImage,
  aspectRatio,
  isCircular = false,
}) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="mt-[60px] mb-[60px] relative w-[95%] sm:w-[80%] lg:min-h-[77vh] xl:min-h-[85vh] sm:min-h-[70vh] h-[60vh] rounded-2xl bg-white text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeModal}>
                <span className="sr-only">Close menu</span>
                <CloseIcon />
              </button>
              <ImageCropper
                updateAvatar={updateAvatar}
                closeModal={closeModal}
                uploadedImage={uploadedImage}
                aspectRatio={aspectRatio}
                isCircular={isCircular}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
