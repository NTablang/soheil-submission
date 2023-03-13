import Image from "next/image";
import React from "react";
import blob from "@/public/blob.png";
import NoisyTexture from "@/components/NoisyTexture";
import LoginModal from "@/components/LoginModal";

function login() {
  const BackgroundGraphics = () => {
    return (
      <>
        <Image
          className="absolute left-[15vw] top-[10vh] h-[650px] w-auto z-[-1] rotate-90"
          width={100} // overriden
          height={100} // overriden
          quality={100}
          src={blob.src}
          alt="blob"
          priority
        />
        <NoisyTexture />
      </>
    );
  };

  return (
    <div>
      <BackgroundGraphics />
      <LoginModal />
    </div>
  );
}

export default login;
