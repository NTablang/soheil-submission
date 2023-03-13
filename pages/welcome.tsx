import React from "react";
import blob from "@/public/blob.png";
import Image from "next/image";
import NoisyTexture from "@/components/NoisyTexture";
import CoolButton from "@/components/CoolButton";
import { useRouter } from "next/router";
import { BsArrowRight } from "react-icons/bs";

function Welcome() {
  const router = useRouter();

  const toLogin = () => {
    router.push("/login");
  };
  
  const BackgroundGraphics = () => {
    return (
      <>
        <Image
          className="w-auto h-[650px] absolute left-[2vw] z-[-1]"
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
    <div className=" h-screen w-screen text-black">
      <BackgroundGraphics />
      <div className="h-full w-full pl-64 pr-96">
        <div className="h-full border-l border-dashed border-[#0000003e] pt-44 pl-4">
          <div className="font-monumentExtended text-7xl">The ML Lab™</div>
          <div className="mt-10" />
          <div className="font-spaceMono text-xl opacity-70">
            A platform for building empirically-relevant theoretical foundations
            of reliable deep learning with a focus on understanding its
            robustness, generalizability, and interpretability.
          </div>
          <div className="mt-10" />
          <CoolButton text={"Hop In"} onClick={toLogin} icon={ <BsArrowRight size={15} />}/>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
