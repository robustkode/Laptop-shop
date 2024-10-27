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
  console.log(img, isValidURL(img), img?.preview, "drop");

  return (
    <div className="mb-4">
      {isValidURL(img) || img?.preview ? (
        <div className="relative rounded-sm">
          <Image
            src={isValidURL(img) ? img : img.preview}
            alt={img?.name}
            className="w-full h-96 object-cover rounded-sm"
            width={100}
            height={200}
          />
          <div className="absolute top-2 right-2 bg-primary-lig rounded-full p-3">
            <X
              className="icon-lg text-secondary cursor-pointer"
              onClick={handleDelete}
            />
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
