import Card from "@/components/Card";
import CoolButton from "@/components/CoolButton";
import DashboardLayout from "@/components/DashboardLayout";
import FileRow from "@/components/FileRow";
import LoadingOverlay from "@/components/LoadingOverlay";
import MainLayout from "@/components/MainLayout";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import StatusTag from "@/components/StatusTag";
import { auth, db, storage } from "@/firebase";
import {
  addBlurBlue,
  addBrightness,
  addGaussianNoiseBlue,
  addGreenTint,
  CustomImageFile,
  uploadImage,
} from "@/utils/photo";
import axios from "axios";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { FileContent, useFilePicker } from "use-file-picker";

function Dashboard() {
  const router = useRouter();
  const [activeImage, setActiveImage] =
    React.useState<CustomImageFile | null>();
  const [filteredImage, setFilteredImage] =
    React.useState<CustomImageFile | null>();
  const [gaussianImage, setGaussianImage] = React.useState<string>();
  const [filesUploaded, setFilesUploaded] = React.useState<CustomImageFile[]>(
    []
  );
  const [filteringSelectedPhoto, setFilteringSelectedPhoto] =
    React.useState(false);
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "ArrayBuffer",
    accept: "image/*",
    multiple: true,
  });

  useEffect(() => {

    fetch ("/hello_world").then((response) => {
      // console.error(response.body);
      // print response
      console.log(response);
    });
  })

  const uploadImages = async () => {
    for await (const file of filesContent) {
      try {
        // make sure this file's name is not in filesUploaded
        const isAlreadyUploaded =
          filesUploaded.filter((f) => f.name === file.name).length > 0;
        if (isAlreadyUploaded) continue;

        // else then upload the file
        const fileUploaded = (await uploadImage(file)) as CustomImageFile;
        // console.warn(fileUploaded);
        if (fileUploaded) {
          setFilesUploaded((prev) => [...prev, fileUploaded]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleNoiseBlue = async () => {
    if (activeImage) {
      setFilteringSelectedPhoto(true);
      addGaussianNoiseBlue(activeImage?.url, 0, 100, (imgSrc: string) => {
        setGaussianImage(imgSrc);
        const newImage = {
          name: `new_img_${new Date()}` + ".jpg",
          content: imgSrc,
          lastModified: new Date().getTime(),
        } as FileContent;
        filesContent.push(newImage);
        console.log("justpushed hoe")
        uploadImages();
        setFilteringSelectedPhoto(false);
      });
    }
  };

  const handleBlueifyWithBlur = async () => {
    if (activeImage) {
      setFilteringSelectedPhoto(true);
      addBlurBlue(activeImage?.url, 10, (imgSrc: string) => {
        setGaussianImage(imgSrc);
        const newImage = {
          name: `new_img_${new Date()}` + ".jpg",
          content: imgSrc,
          lastModified: new Date().getTime(),
        } as FileContent;
        filesContent.push(newImage);
        uploadImages();
        setFilteringSelectedPhoto(false);
      });
    }
  };

  const handleGreenify = async () => {
    if (activeImage) {
      setFilteringSelectedPhoto(true);
      addGreenTint(activeImage?.url, (imgSrc: string) => {
        setGaussianImage(imgSrc);
        const newImage = {
          name: `new_img_${new Date()}` + ".jpg",
          content: imgSrc,
          lastModified: new Date().getTime(),
        } as FileContent;
        filesContent.push(newImage);
        uploadImages();
        setFilteringSelectedPhoto(false);
      });
    }
  };

  const handleBrightness = async () => {
    if (activeImage) {
      setFilteringSelectedPhoto(true);
      addBrightness(activeImage?.url, 0.5, (imgSrc: string) => {
        setGaussianImage(imgSrc);
        const newImage = {
          name: `new_img_${new Date()}` + ".jpg",
          content: imgSrc,
          lastModified: new Date().getTime(),
        } as FileContent;
        filesContent.push(newImage);
        uploadImages();
        setFilteringSelectedPhoto(false);
      });
    }
  };

  // when user selects files, upload them
  useEffect(() => {
    if (filesContent.length > 0) {
      uploadImages();
    }
  }, [filesContent]);

  const handleNextStep = () => {
    router.push("/label");
  };

  // will be used for navigation
  const canGoToNextPage = useMemo(() => {
    // cant go to next step without user uploading something
    if (filesContent.length == 0) {
      return false;
    }

    return filesUploaded.length >= 0;
  }, [filesUploaded, filesContent]);

  const tabHeaders = ["PREVIEW", "FILE NAME", "STATUS"];

  return (
    <MainLayout
      isToNextPageAvailable={canGoToNextPage}
      toNextPage={handleNextStep}
    >
      <LoadingOverlay
        isVisible={filteringSelectedPhoto}
        textOverlay={"Adding filters..."}
      />
      <Navbar />
      <DashboardLayout>
        <ProgressBar activeCategory={"Images"} />
        <div className="h-5" />
        <div className="flex justify-between gap-4">
          {/* ADD PHOTOS SECTION */}
          <Card
            title={"Images Upload"}
            subtitle={"Please upload your images here :)"}
          >
            {/* WHEN THERE ARE IMAGES UPLOADED */}
            {filesContent && filesContent.length != 0 && (
              <div className="overflow-scroll h-[60vh] w-[30vw] border border-black rounded-md flex flex-col ">
                <div className="flex px-4 bg-[#FAFAFA] text-xs py-4 border-b border-black justify-around">
                  {tabHeaders.map((header, index) => (
                    <div key={index}>{header}</div>
                  ))}
                </div>
                {filesContent.map((file, index) => (
                  <FileRow
                    onClick={() => setActiveImage(filesUploaded[index])}
                    file={file}
                    key={index}
                    successStatusTag={"UPLOADED"}
                    warningStatusTag={"UPLOADING"}
                    isSuccess={
                      filesUploaded?.find((f) => f.name === file.name) !=
                      undefined
                    }
                    allowPointerEvents={
                      filesUploaded?.find((f) => f.name === file.name) !=
                      undefined
                    }
                  />
                ))}
              </div>
            )}
            {/* WHEN THERE IS NO IMAGES UPLOADED */}
            {filesContent && filesContent.length === 0 && (
              <div
                className="h-[40vh] cursor-pointer hover:bg-[#F3F3F7]
           w-full flex justify-center items-center"
                onClick={openFileSelector}
              >
                Click to upload files
              </div>
            )}
          </Card>
          {/* ADD FILTERS SECTION */}
          <Card
            title={"Filter"}
            subtitle={"Add filter to your existing images!"}
            scrollable={true}
            height={"h-[60vh]"}
          >
            {/* WHEN THERE IS AN IMAGE SELECTED */}
            {activeImage && (
              <div>
                <div className="flex gap-4  w-[40vw]">
                  <Image
                    alt={"selection img"}
                    src={activeImage?.url}
                    className="w-[50%] h-[auto]"
                    width={50}
                    unoptimized={true}
                    height={50}
                  />
                  {gaussianImage && (
                    <Image
                      src={gaussianImage}
                      alt={"selection img"}
                      className="w-[50%] h-[auto]"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <div className=" flex-wrap flex-col items-center justify-center flex  gap-2 mt-4">
                  <CoolButton
                    text={"Noise with Blue!"}
                    onClick={handleNoiseBlue}
                    type={"white-on-black"}
                  />
                  <CoolButton
                    text={"Blur with Blue!"}
                    onClick={handleBlueifyWithBlur}
                    type={"white-on-black"}
                  />
                  <CoolButton
                    text={"Greenify!"}
                    onClick={handleGreenify}
                    type={"white-on-black"}
                  />
                  <CoolButton
                    text={"Brighten!"}
                    onClick={handleBrightness}
                    type={"white-on-black"}
                  />
                </div>
              </div>
            )}
            {/* WHEN THERE IS NO IMAGE SELECTED */}
            {!activeImage && (
              <div className="flex justify-center items-center h-[40vh]">
                <div className="text-center">
                  <div className="text-md font-bold">No image selected</div>
                  <div className="text-xs px-20">
                    Please select an image from the list on the left once
                    you&apos;ve uploaded
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </MainLayout>
  );
}

export default Dashboard;
