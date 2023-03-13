import { auth, db, storage } from "@/firebase";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FileContent } from "use-file-picker";

export type CustomImageFile = {
  name: string;
  url: string;

};

export type CustomImageFileFromFirestore = {
  createdBy: string;
  url: string;
  createdAt: Timestamp;
  metaId: string;
  name?: string;
  content?: any;
  label?: string;
  points?: number[];
  segmentationLabel?: string;
};

export const uploadImage = async (file: any) => {
  const isAnOctet =
    typeof file.content === "string" &&
    file.content.startsWith("data:application/octet");
    console.warn(isAnOctet)
  if (isAnOctet) {
    console.error(file.content)
    const response = await fetch(file.content);
    console.error(response)
    const blob = await response.blob();
    console.error(blob);
    console.error(file)
    const storageRef = ref(storage, `/images/${file.name}`);
    if (file) {
        // turn this blob into an image file for firebase upload
        const imageFile = new File([blob], file.name);
        const res = await uploadBytesResumable(storageRef, imageFile).then(
        async (snapshot) => {
            const downloadURL = await getDownloadURL(snapshot.ref);
          await addDoc(collection(db, "images"), {
            url: downloadURL,
            name: file.name,
            createdAt: Timestamp.now(),
            createdBy: auth.currentUser?.uid,
          });
          const newImageMetadata = {
            uploaderId: auth.currentUser?.uid,
            name: file.name,
            url: downloadURL,
          } as CustomImageFile;
          return newImageMetadata;
        });
        return res; 

    } else {
        console.error("no file");
    }
  } else {
    const storageRef = ref(storage, `/images/${file.name}`);
    if (file) {
      const res = await uploadBytesResumable(storageRef, file.content).then(
        async (snapshot) => {

          console.log("Uploaded a blob or file!");
          const downloadURL = await getDownloadURL(snapshot.ref);
          await addDoc(collection(db, "images"), {
            url: downloadURL,
            name: file.name,
            createdAt: Timestamp.now(),
            createdBy: auth.currentUser?.uid,
          });
          const newImageMetadata = {
            uploaderId: auth.currentUser?.uid,
            name: file.name,
            url: downloadURL,
          } as CustomImageFile;
          return newImageMetadata;
        }
      );

      return res;
    }
  }
};

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const addGaussianNoiseBlue = async (
  imageUrl: string,
  mean = 0,
  std = 100,
  callbackFn: (imageSrc: string) => void
) => {
  const urlUpload = serverUrl + "add_noise_blue";
  const fileName = "myFile.jpg";

  fetch(imageUrl).then(async (response) => {
    // turn image from url into blob then file
    const blob = await response.blob();
    const file = new File([blob], fileName);

    // prepare form data for request
    const formData = new FormData();
    formData.append("image", file);
    formData.append("mean", mean.toString());
    formData.append("std", std.toString());

    // send request
    fetch(urlUpload, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())

      .then((data) => {
        const contentType = response.headers.get("content-type");
        const base64 = data.image;
        const imgSrc = `data:${contentType};base64,${base64}`;

        callbackFn(imgSrc);
      });
  });
};

export const addBlurBlue = async (
  imageUrl: string,
  kernel = 10,
  callbackFn: (imageSrc: string) => void
) => {
  const urlUpload = serverUrl + "add_blur_blue";
  const fileName = "myFile.jpg";

  fetch(imageUrl).then(async (response) => {
    // turn image from url into blob then file
    const blob = await response.blob();
    const file = new File([blob], fileName);

    // prepare form data for request
    const formData = new FormData();
    formData.append("image", file);
    formData.append("ksize", `${kernel}`);

    // send request
    fetch(urlUpload, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())

      .then((data) => {
        const contentType = response.headers.get("content-type");
        const base64 = data.image;
        const imgSrc = `data:${contentType};base64,${base64}`;

        callbackFn(imgSrc);
      });
  });
};

export const addGreenTint = async (
  imageUrl: string,
  callbackFn: (imageSrc: string) => void
) => {
  const urlUpload = serverUrl + "add_green_tint";
  const fileName = "myFile.jpg";

  fetch(imageUrl).then(async (response) => {
    // turn image from url into blob then file
    const blob = await response.blob();
    const file = new File([blob], fileName);

    // prepare form data for request
    const formData = new FormData();
    formData.append("image", file);

    // send request
    fetch(urlUpload, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())

      .then((data) => {
        const contentType = response.headers.get("content-type");
        const base64 = data.image;
        const imgSrc = `data:${contentType};base64,${base64}`;

        callbackFn(imgSrc);
      });
  });
};

export const addBrightness = async (
  imageUrl: string,
  brightness = 0.5,
  callbackFn: (imageSrc: string) => void
) => {
  const urlUpload = serverUrl + "add_brightness";
  const fileName = "myFile.jpg";

  fetch(imageUrl).then(async (response) => {
    // turn image from url into blob then file
    const blob = await response.blob();
    const file = new File([blob], fileName);

    // prepare form data for request
    const formData = new FormData();
    formData.append("image", file);
    formData.append("brightness", brightness.toString());

    // send request
    fetch(urlUpload, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())

      .then((data) => {
        const contentType = response.headers.get("content-type");
        const base64 = data.image;
        const imgSrc = `data:${contentType};base64,${base64}`;

        callbackFn(imgSrc);
      });
  });
};


export const fetchImages = async () => {
    const currentImages: CustomImageFileFromFirestore[] = [];
    const collectionRef = collection(db, "images");
    const snapshot = await getDocs(collectionRef);
    snapshot.forEach((doc) => {
      const ImageObject = {
        metaId: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        lastModified: doc.data().createdAt.toDate(),
        createdBy: doc.data().createdBy,
        name: doc.data().name,
        content: doc.data().url,
        url: doc.data().url,
        label: doc.data().label,
        points: doc.data().points,
        segmentationLabel: doc.data().segmentationLabel,
      } satisfies CustomImageFileFromFirestore & FileContent;
      currentImages.push(ImageObject);
    });
    // setImages(currentImages);
    return currentImages;
};