import Canvas from "@/components/Canvas";
import Card from "@/components/Card";
import CoolButton from "@/components/CoolButton";
import DashboardLayout from "@/components/DashboardLayout";
import DynamicCanvas from "@/components/DynamicCanvas";
import FormField from "@/components/FormField";
import MainLayout from "@/components/MainLayout";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import { CustomImageFileFromFirestore, fetchImages } from "@/utils/photo";
import Image from "next/image";
import React, { useEffect, useRef } from "react";


function Segmentation() {
  const [images, setImages] = React.useState<CustomImageFileFromFirestore[]>(
    []
  );
  const canvasRef = useRef();


  const [
    activeImage,
    setActiveImage,
  ] = React.useState<CustomImageFileFromFirestore | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  // get all images from firestore
  useEffect(() => {
    fetchImages().then((images) => {
      setImages(images);
    });

    return () => {
        fetchImages().then((images) => {
            setImages(images);
          });
    }
  }, []);

  useEffect(() => {
    if (images.length == 0) return;
    setActiveImage(images[0]);
  }, [images]);

  useEffect(() => {
    if (images.length == 0) return;
    setActiveImage(images[activeIndex]);
  }, [activeIndex]);

  useEffect(() => {}, [activeImage]);

  const drawRectangle = () => {
    if (canvasRef.current) {
      // @ts-ignore
      const context = canvasRef.current.getContext("2d");
      context.strokeStyle = "magenta";
      context.lineWidth = 1;
      context.strokeRect(0, 0, 10, 10);
    }
  };


  useEffect(() => {
    drawRectangle();
  }, []);

  return (
    <MainLayout scrollable>
      <Navbar />
      <DashboardLayout>
        <ProgressBar activeCategory={"Segmentation"} />
        <div className="h-5" />
        <div className="flex justify-between gap-4">
          {/* ADD PHOTOS SECTION */}
          <Card
            withPadding={true}
            scrollable={true}
            title={"Image Segmentation"}
            subtitle={"Please annotate objects in the image."}
          >
            { activeImage && images.length > 0 && <DynamicCanvas videoSourceRaw={activeImage.url} imagesRaw={images} />}

          </Card>
        </div>
      </DashboardLayout>
    </MainLayout>
  );
}

export default Segmentation;
