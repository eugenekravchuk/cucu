import React, { createContext, useState, FC } from "react";

// Define interface for image context values
interface ImageContextType {
  image: string;
  setImage: (newImage: string) => void;
}

// Create the context
export const ImageContext = createContext<ImageContextType>({
  image: "", // Initial image (or a placeholder)
  setImage: () => {},
});

// Define props for ImageProvider
type ImageProviderProps = {
  children: React.ReactNode;
};

// Component with types
export const ImageProvider: FC<ImageProviderProps> = ({ children }) => {
  const [image, setImage] = useState<string>("");

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};
