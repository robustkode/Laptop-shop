"use client";
import Dropzone from "react-dropzone";
import { X } from "lucide-react";
import Image from "next/image";
import { isValidURL } from "@/lib/utils";

export default function DropImage({ img, setImg }) {
  const handleDrop = (acceptedImages) => {
    // If there's already a file, do not update the state
    if (acceptedImages.length > 0) {
      const newImage = acceptedImages[0];
      setImg(
        Object.assign(newImage, {
          preview: URL.createObjectURL(newImage),
        })
      );
    }
  };

  const handleDelete = () => {
    try {
      URL.revokeObjectURL(img.preview);
    } catch (_) {}
    setImg(null);
  };

  return (
    <div className="mb-4">
      {isValidURL(img) || img?.preview ? (
        <div className="rounded-sm">
          <div className="relative">
            <Image
              src={isValidURL(img) ? img : img.preview}
              alt="product-image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-[100%] object-cover max-w-[300px] mx-auto"
            />
            <div className="absolute top-2 right-2 bg-primary-lig rounded-full p-3">
              <X
                className="icon-lg text-secondary cursor-pointer"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      ) : (
        <Dropzone
          onDrop={handleDrop}
          accept={{ "image/*": [".jpeg", ".png", ".webp", ".svg"] }}
          maxFiles={1}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="flex items-center justify-center border-2 border-primary rounded-sm py-8 my-6 px-2">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} type="file" />
                <p>Drag and drop an image here, or click to select one</p>
              </div>
            </div>
          )}
        </Dropzone>
      )}
    </div>
  );
}
