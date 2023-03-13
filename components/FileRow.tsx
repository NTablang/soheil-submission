import { CustomImageFileFromFirestore } from "@/utils/photo";
import Image from "next/image";
import React from "react";
import { FileContent } from "use-file-picker";
import StatusTag from "./StatusTag";

type Props = {
  onClick: () => void;
  allowPointerEvents?: boolean;
  file: FileContent | CustomImageFileFromFirestore;
  successStatusTag: string;
  warningStatusTag: string;
  isSuccess?: boolean;
};

function FileRow({
  onClick,
  allowPointerEvents,
  file,
  successStatusTag,
  warningStatusTag,
  isSuccess,
}: Props) {
  const isADataImage = (url: string) => {
    // console.warn(url);
    if (typeof url == "string" && url.startsWith("https:")) return true;
    if (typeof url == "object") return false;
    if (typeof url !== "string") return false;
    return url.startsWith("data:application");
  };

  return (
    <div
      onClick={onClick}
      className={`border-b border-black hover:bg-[#FAFAFA] flex text-xs items-center 
      ${ allowPointerEvents ? "cursor-pointer" : "pointer-events-none"} justify-around py-2 `}
    >
      <Image
        alt={file.name || "image"}
        src={
          isADataImage(file.content)
            ? file.content
            : URL.createObjectURL(new Blob([file.content]))
        }
        width={50}
        height={50}
        className="h-[50px] w-[50px] ml-2"
      />
      <div className="w-[35%] text-ellipsis white truncate">{file.name}</div>
      <StatusTag
        text={isSuccess ? successStatusTag : warningStatusTag}
        isSuccess={isSuccess ? true : false}
      />
    </div>
  );
}

export default FileRow;
