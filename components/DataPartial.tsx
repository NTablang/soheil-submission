// @ts-nocheck
import DashboardLayout from "@/components/DashboardLayout";
import MainLayout from "@/components/MainLayout";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/Card";
import { auth, db } from "@/firebase";
import { CustomImageFileFromFirestore, fetchImages } from "@/utils/photo";
import { Image, Layer, Stage } from "react-konva";
import DynamicPolygonAnnotation from "@/components/DynamicPolygonAnnotation";
import dynamic from "next/dynamic";
import FormField from "./FormField";
import CoolButton from "./CoolButton";

function Data() {
  const [image, setImage] = useState();

  const [images, setImages] = useState<CustomImageFileFromFirestore[]>();
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [videoSource, setVideoSource] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [segmentationLabel, setSegmetationLabel] = React.useState<string>("");

  useEffect(() => {
    fetchImages().then((images) => {
      if (images) {
        setImages(images);
      }
    });
  }, []);

  const videoElement = useMemo(() => {
    let element;
    if (images) {
      element = new window.Image();
      element.src = images[activeIndex].url;
      element.onload = () => {
        element.width = element.width * 0.15;
        element.height = element.height * 0.15;
      };
    }

    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSource, images, activeIndex]); //it may come from redux so it may be dependency that's why I left it as dependecny...

  useEffect(() => {
    if (images && points) {
      setFlattenedPoints(points.concat([]).reduce((a, b) => a.concat(b), []));
    }
  }, [points, position]);

  useEffect(() => {
    if (images) {
      const onload = function () {
        setSize({
          width: videoElement.width,
          height: videoElement.height,
        });
        setImage(videoElement);
        imageRef.current = videoElement;
      };
      videoElement.addEventListener("load", onload);
      return () => {
        videoElement.removeEventListener("load", onload);
      };
    }
  }, [videoElement, videoSource, images]);
  // update existing data from db to front end
  useEffect(() => {
    if (images) {
      if (images[activeIndex].points) {
        const currentPoints = [];
        for (let i = 0; i < images[activeIndex].points.length; i++) {
          const currentX = images[activeIndex].points[i].x;
          const currentY = images[activeIndex].points[i].y;
          currentPoints.push([currentX, currentY]);
        }
        setPoints(currentPoints);
      }
      if (images[activeIndex].segmentationLabel) {
        setSegmetationLabel(images[activeIndex].segmentationLabel);
      }
    }
  }, [images, activeIndex]);

  return (
    <MainLayout scrollable={true}>
      <Navbar />
      <DashboardLayout>
        <ProgressBar activeCategory={"Data"} />
        <div className="h-5" />
        <Card scrollable={true} title={"Your labels and their segmentations"}>
          <div className="flex justify-center items-center pointer-events-none">
            <Stage width={size.width || 650} height={size.height || 302}>
              <Layer>
                <Image
                  ref={imageRef}
                  image={image}
                  x={0}
                  y={0}
                  width={size.width}
                  height={size.height}
                />
                <DynamicPolygonAnnotation
                  points={points}
                  flattenedPoints={flattenedPoints}
                  isFinished={true}
                />
              </Layer>
            </Stage>
          </div>
          <div className="mt-10 flex justify-around px-44">
            <div
              className={`${
                activeIndex == 0 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <CoolButton
                onClick={() => setActiveIndex(activeIndex - 1)}
                text={"Previous"}
                type={"white-on-black"}
              />
            </div>
            <div
              className={`${
                activeIndex == images?.length - 1
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              <CoolButton
                onClick={() => setActiveIndex(activeIndex + 1)}
                text={"Next"}
                type={"white-on-black"}
              />
            </div>
          </div>
          {images && (
            <div className="pointer-events-none mt-10 px-44 opacity-50">
              <FormField
                label={"You said that this was an image of a ..."}
                value={images[activeIndex].label}
              />
              <FormField
                label={"Segmentation Label"}
                value={images[activeIndex].segmentationLabel}
                inputStyle={"border-[magenta] text-[magenta]"}
                labelStyle={"text-[magenta]"}
              />
            </div>
          )}

          {/* {JSON.stringify(images)} */}
        </Card>
      </DashboardLayout>
    </MainLayout>
  );
}

export default Data;
