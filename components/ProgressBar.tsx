import React from "react";
import Card from "./Card";

type Props = {
  activeCategory: "Images" | "Labels" | "Segmentation" | "Prediction";
};
function ProgressBar({ activeCategory }: Props) {
  const categories = ["Images", "Labels", "Segmentation", "Data"];

  return (
    <Card>
      <div className="flex justify-between px-20 text-xs">
        <div className="flex w-[50%] justify-between">
          {categories.map((category, i) => (
            <div
              key={i}
              className="flex flex-row gap-2 items-center justify-center"
            >
              <div
                className={`border border-black rounded-full h-[35px] w-[35px] flex justify-center items-center ${
                  activeCategory == category || i <= categories.indexOf(activeCategory) ? "bg-[#FFBB00]" : ""
                }`}
              >
                {categories.findIndex((c) => c === category) + 1}
              </div>
              <div>{category}</div>
            </div>
          ))}
        </div>
        {/* INITIALLY included this because I thought I was gonna have enough time for prediction */}
        {/* <div className="flex flex-row gap-2 items-center justify-center">
          <div
            className={`border border-black rounded-full h-[35px] w-[35px] flex justify-center items-center ${
              activeCategory == "Prediction" ? "bg-[#FFBB00]" : ""
            }`}
          >
            {": )"}
          </div>
          <div>Prediction</div>
        </div> */}
      </div>
    </Card>
  );
}

export default ProgressBar;
