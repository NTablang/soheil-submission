// @ts-nocheck
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Stage, Layer, Image } from "react-konva";
import Card from "./Card";
import CoolButton from "./CoolButton";
import PolygonAnnotation from "./PolygonAnnotation";
import { CustomImageFileFromFirestore, fetchImages } from "@/utils/photo";
import FormField from "./FormField";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import DynamicPolygonAnnotation from "./DynamicPolygonAnnotation";
import { useRouter } from "next/router";

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: 20,
  marginBottom: 20,
};
const columnStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 20,
  padding: 20,
};

type CanvasProps = {
  videoSourceRaw: string;
  imagesRaw: CustomImageFileFromFirestore[];
};

const Canvas = ({ videoSourceRaw, imagesRaw }: CanvasProps) => {
  const [image, setImage] = useState();
  const [images, setImages] = useState(imagesRaw);
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [videoSource, setVideoSource] = useState(videoSourceRaw);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointsFromDB, setPointsFromDB] = useState([]);
  const [segmentationLabel, setSegmetationLabel] = React.useState<string>("");
  const [segmentationLabelError, setSegmentationLabelError] =
    React.useState("");
  const router = useRouter();

  const videoElement = useMemo(() => {
    const element = new window.Image();
    element.src = images[activeIndex].url;
    element.onload = () => {
      element.width = element.width * 0.15;
      element.height = element.height * 0.15;
    };

    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSource, images, activeIndex]); //it may come from redux so it may be dependency that's why I left it as dependecny...

  useEffect(() => {
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
  }, [videoElement, videoSource, images]);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };
  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);
  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };

  const reset = () => {
    setPoints([]);
    setPolyComplete(false);
  };

  const handleGroupDragEnd = (e) => {
    // drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };

  useEffect(() => {
    reset();
    setSegmentationLabelError("");
    setSegmetationLabel("");
    // setPoints([]);
    if (images[activeIndex].points) {
      for (const point of images[activeIndex].points) {
        setPointsFromDB([...pointsFromDB, [point.x, point.y]]);
      }
    }
    if (images[activeIndex].segmentationLabel) {
      setSegmetationLabel(images[activeIndex].segmentationLabel);
    }
  }, [activeIndex, images]);

  // the upload mechanism
  const handleSegmentation = () => {
    if (segmentationLabel === "") {
      setSegmentationLabelError("Please enter a label");
      return;
    }
    if (points.length == 0) {
      setSegmentationLabelError("Please draw a polygon");
      return;
    }
    const imageRef = doc(db, "images", images[activeIndex].metaId);

    const objectArray = [];
    for (let i = 0; i < points.length; i++) {
      const coordinates = {
        x: points[i][0],
        y: points[i][1],
      };
      objectArray.push(coordinates);
    }

    // update this data in database
    // then fetch new data from the database
    // then set the new data to the state
    // then move to the next image
    updateDoc(imageRef, {
      points: objectArray,
      segmentationLabel: segmentationLabel,
    }).then((res) => {
      fetchImages()
        .then((images) => {
          setImages(images);
        })
        .then(() => {
          if (activeIndex < images.length - 1) {
            setActiveIndex(activeIndex + 1);
          }
          // if the active index is the last image,
          // then go to data page
          else {
            router.push("/data");
          }
        });
    });
  };

  // update existing data from db to front end
  useEffect(() => {
    if (images[activeIndex].points) {
      const currentPoints = [];
      for (let i = 0; i < images[activeIndex].points.length; i++) {
        const currentX = images[activeIndex].points[i].x;
        const currentY = images[activeIndex].points[i].y;
        currentPoints.push([currentX, currentY]);
      }
      setPoints(currentPoints);
      setPolyComplete(true);
    }
    if (images[activeIndex].segmentationLabel) {
      setSegmetationLabel(images[activeIndex].segmentationLabel);
    }
  }, [images, activeIndex]);

  useEffect(() => {
    fetchImages().then((images) => {
      setImages(images);
    });
  }, []);

  return (
    <>
      <div style={wrapperStyle}>
        <div style={columnStyle}>
          <Stage
            width={size.width || 650}
            height={size.height || 302}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
          >
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
                handlePointDragMove={handlePointDragMove}
                handleGroupDragEnd={handleGroupDragEnd}
                handleMouseOverStartPoint={handleMouseOverStartPoint}
                handleMouseOutStartPoint={handleMouseOutStartPoint}
                isFinished={isPolyComplete}
              />
            </Layer>
          </Stage>
          <div className="flex justify-around mt-5 flex-col px-5">
            <div className="flex flex-row justify-center">
              <div className={`opacity-70 pointer-events-none`}>
                <CoolButton
                  type={"white-on-black"}
                  onClick={() => {}}
                  text={`${activeIndex}/${images.length - 1} More to go`}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <CoolButton
                type={"white-on-black"}
                onClick={undo}
                text={"Undo"}
              />
              <CoolButton
                type={"white-on-black"}
                onClick={reset}
                text={"Reset"}
              />
            </div>
          </div>
        </div>
        <Card
          title={"Segmentation information"}
          subtitle={"Segmentation information to be saved"}
          scrollable={true}
          height={"h-auto"}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(points)}</pre>
        </Card>
      </div>

      <Card
        title={"Label your segmentation"}
        subtitle={"Whats up with the bounding box?"}
        scrollable={true}
        height={"h-auto"}
      >
        <FormField
          label={"Segmentation Label"}
          placeholder={"This is a segmentation of..."}
          value={segmentationLabel}
          onChange={(e) => setSegmetationLabel(e.target.value)}
          error={segmentationLabelError}
        />
        <CoolButton
          text={"Segment!"}
          type={"yellow"}
          onClick={handleSegmentation}
        />
      </Card>
    </>
  );
};

export default Canvas;
