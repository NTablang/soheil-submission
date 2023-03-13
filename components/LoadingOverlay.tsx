import React from "react";

type Props = {
  isVisible: boolean;
  textOverlay: string;
};
function LoadingOverlay({ isVisible, textOverlay }: Props) {
  return (
    <div
      className={`fixed h-screen flex items-center justify-center 
      font-spaceMono text-black w-screen  z-[1000] ${
        isVisible ? "bg-[#ffffffdf]" : "opacity-0 pointer-events-none"
      }`}
    >
      {textOverlay}
    </div>
  );
}

export default LoadingOverlay;
