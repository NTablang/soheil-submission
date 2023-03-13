import React from "react";
type Props = {
  onClick: () => void;
  text?: string;
  type?: "floating-black" | "white-on-black" | "yellow" | "link";
  icon?: any
};

function CoolButton({ onClick, icon, type = "floating-black", text }: Props) {
  if (type === "floating-black") {
    return (
      <div
        className="w-[13vw] h-[8vh] border border-black ml-4"
        onClick={onClick}
      >
        <div className="floating-btn flex gap-4 justify-center items-center text-white">
          <div className="font-spaceMono">{text}</div>
          {icon}
         
        </div>
      </div>
    );
  } else if (type === "white-on-black") {
    return (
      <div
        className="px-6 py-4 border w-[350px] border-black cursor-pointer
      justify-between text-sm items-center text-black flex transition-all hover:bg-black hover:text-white"
        onClick={onClick}
      >
        <div>{text}</div>
        {icon}
      </div>
    );
  } else if (type === "link") {
    return (
      <span
        className="ml-4 primary-link underline cursor-pointer hover:text-black transition-all"
        onClick={onClick}
      >
        {text}
        {icon}
      </span>
    );
  }
  return (
    <div
      className="w-[100px] h-[6vh] border border-black hover:bg-black
       hover:text-[#FFBB00] cursor-pointer bg-[#FFBB00] flex 
       justify-center items-center mt-4 transiiton-all"
      onClick={onClick}
    >
      {text}
      {icon}
    </div>
  );
}

export default CoolButton;
