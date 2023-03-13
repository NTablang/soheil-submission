import Image from "next/image";
import React from "react";
import noisygrain from "@/public/noisy-grain.png";
type Props = {
    opacity?: number // between 0 and 1
};

function NoisyTexture({opacity = 1}: Props ) {
  return (
    <img
      src={noisygrain.src}
      className={`top-0 left-0 fixed w-screen h-screen z-[100] pointer-events-none`}
      style={{opacity: opacity}}
      alt="noisy grain"
    />
  );
}

export default NoisyTexture;
