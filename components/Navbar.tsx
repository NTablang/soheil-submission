import { auth } from "@/firebase";
import { useRouter } from "next/router";
import React from "react";

function Navbar() {
  const router = useRouter();

  const logOut = () => {
    auth.signOut();
    router.push("/");
  };

  return (
    <div className=" w-full  border border-black bg-white text-black px-10 py-5 flex justify-between">
      <div className="font-monumentExtended text-xl">Soheil Labs</div>
      <div
        onClick={logOut}
        className="font-spaceMono text-md primary-link cursor-pointer 
   hover:underline transition-all hover:text-black"
      >
        sign out
      </div>
    </div>
  );
}

export default Navbar;
