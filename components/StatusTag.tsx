import React, { useEffect } from "react";

type Props = {
  text: string;
  isSuccess?: boolean;
};

function StatusTag({ text, isSuccess = true }: Props) {
  useEffect(() => {
    console.log(isSuccess);
  });
  if (isSuccess) {
    return (
      <div
        className={`bg-[#68d000b7] ml-16 px-4 py-3 rounded-xl transition-all`}
      >
        {text}
      </div>
    );
  }
  return (
    <div className={`bg-[#FFBB00] ml-16 px-4 py-3 rounded-xl transition-all`}>
      {text}
    </div>
  );
}

export default StatusTag;
