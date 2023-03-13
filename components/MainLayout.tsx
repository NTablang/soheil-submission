import React from "react";
import { BsArrowRight } from "react-icons/bs";
import CoolButton from "./CoolButton";

type Props = {
  children: React.ReactNode;
  toNextPage?: () => void;
  isToNextPageAvailable?: boolean;
  scrollable?: boolean;
};
function MainLayout({ children, toNextPage, isToNextPageAvailable, scrollable = false }: Props) {
  return (
    <div className={`bg-[#F3F3F7] w-screen ${scrollable ? "h-auto" : "fixed overflow-hidden h-screen"} `}>
      {children}
      {toNextPage && (
        <div
          className={`absolute bottom-10 right-44 transition-all ${
            isToNextPageAvailable
              ? "opacity-100 animate-bounce"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <CoolButton
            type={"yellow"}
            onClick={toNextPage}
            icon={<BsArrowRight size={15} />}
          />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
