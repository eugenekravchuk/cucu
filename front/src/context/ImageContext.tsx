import React, { createContext, useState, FC } from "react";


interface ImageContextType {
  image: string;
  setImage: (newImage: string) => void;
}


export const ImageContext = createContext<ImageContextType>({
  image: "", 
  setImage: () => {},
});


type ImageProviderProps = {
  children: React.ReactNode;
};


export const ImageProvider: FC<ImageProviderProps> = ({ children }) => {
  const [image, setImage] = useState<string>("");

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
};
