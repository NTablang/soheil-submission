import DashboardLayout from "@/components/DashboardLayout";
import MainLayout from "@/components/MainLayout";
import React, { useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import Card from "@/components/Card";
import { auth, db } from "@/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { CustomImageFileFromFirestore, fetchImages } from "@/utils/photo";
import FileRow from "@/components/FileRow";
import { FileContent } from "use-file-picker";
import CoolButton from "@/components/CoolButton";
import Image from "next/image";
import FormField from "@/components/FormField";
import { useRouter } from "next/router";

function Label() {
  const tabHeaders = ["PREVIEW", "FILE NAME", "LABELED"];
  const [images, setImages] = React.useState<CustomImageFileFromFirestore[]>(
    []
  );
  const [activeImage, setActiveImage] =
    React.useState<CustomImageFileFromFirestore | null>(null);
  const [label, setLabel] = React.useState<string>("");
  const [labelError, setLabelError] = React.useState<string>("");
  const router = useRouter();

  // get all images from firestore
  useEffect(() => {
    fetchImages().then((images) => {
      setImages(images);
    });
  }, []);

  // when images are loaded, set the active image
  // to the first image
  useEffect(() => {
    if (images.length == 0) return;
    setActiveImage(images[0]);
  }, [images]);

  useEffect(() => {
    // reset
    setLabel("");
    setLabelError("");

    // if an image has already been labeled,
    // then set the label to the existing label
    if (activeImage && activeImage.label) {
      setLabel(activeImage.label);
    }
  }, [activeImage]);

  const handleLabel = async () => {
    if (label.length == 0) {
      setLabelError("Label cannot be empty");
      return;
    }
    if (activeImage) {
      const collectionRef = collection(db, "images");
      await updateDoc(doc(collectionRef, activeImage.metaId), {
        label: label,
      });
      const newImages = images.map((image) => {
        if (image.metaId == activeImage.metaId) {
          return {
            ...image,
            label: label,
          };
        }
        return image;
      });
      setImages(newImages);
    }
  };

  const isAllLabeled = useMemo(() => {
    return images.every((image) => image.label);
  }, [images]);

  const toNextStep = () => {
    router.push("/segmentation");
  };
  return (
    <MainLayout isToNextPageAvailable={isAllLabeled} toNextPage={toNextStep} scrollable={true}>
      <Navbar />
      <DashboardLayout>
        <ProgressBar activeCategory={"Labels"} />
        <div className="h-5" />
        <div className="flex justify-between gap-4">
          {/* ADD PHOTOS SECTION */}
          <Card
            scrollable={true}
            title={"Uploaded Images"}
            subtitle={"Images from userid " + auth.currentUser?.uid}
          >
            <div className="overflow-scroll h-[60vh]  border border-black rounded-md flex flex-col ">
              <div className="flex px-4 bg-[#FAFAFA] text-xs py-4 border-b border-black justify-around">
                {tabHeaders.map((header, index) => (
                  <div key={index}>{header}</div>
                ))}
              </div>
              {images.map((image, index) => (
                <FileRow
                  onClick={() => setActiveImage(image)}
                  file={image}
                  key={index}
                  successStatusTag={"LABELED"}
                  warningStatusTag={"  "}
                  isSuccess={image.label ? true : false}
                  allowPointerEvents={true}
                />
              ))}
            </div>
          </Card>
          {/* ADD FILTERS SECTION */}
          <Card
            title={"Label"}
            subtitle={"Add labels to your existing images!"}
            scrollable={true}
            height={"h-auto"}
          >
            {activeImage && (
              <div>
                <div className="flex gap-4 ">
                  <Image
                    alt={"selection img"}
                    src={activeImage?.url}
                    className="w-[70%] h-[auto] mx-auto mb-10"
                    width={50}
                    unoptimized={true}
                    height={50}
                  />
                </div>
                <FormField
                  label={"This is an image of a ..."}
                  placeholder={"Enter label here"}
                  error={labelError}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
            )}
            <CoolButton text={"Label!"} type={"yellow"} onClick={handleLabel} />
          </Card>
        </div>
      </DashboardLayout>
    </MainLayout>
  );
}

export default Label;
