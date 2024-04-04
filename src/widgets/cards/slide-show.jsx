import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "/img/image1.png";
import image2 from "/img/image2.png";
import image3 from "/img/image3.png"; 
import {
  ChevronRightIcon, ChevronLeftIcon
} from "@heroicons/react/24/solid";

export function SlideShow () {
// const SlideShow = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sliderStyle = {
  position: "relative",
  width: windowWidth < 640 ? "155%" : "auto",
  left: windowWidth < 640 ? "50%" : "auto",
  transform: windowWidth < 640 ? "translateX(-50%)" : "none",
};

  const slideStyle = {
    outline: "none",
    position: "relative",
    textAlign: "center", // Tambahkan properti textAlign
   
  };

  if (windowWidth >= 640 && windowWidth < 1024) {
    sliderStyle.width = "70px";
    sliderStyle.height = "40px";
  } else if (windowWidth >= 1024) {
    sliderStyle.width = "100%";
    sliderStyle.height = "auto";
  }

  const controlStyle = {
    position: "absolute",
    top: "50%",
    width: "60px",
    height: "60px",
    transform: "translateY(-50%)",
    backgroundColor: "#ffffff",
    color: "#ffff",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "0px",
  };

  // Menambahkan style khusus untuk layar HP SM dan LG
  if (windowWidth >= 640 && windowWidth < 1024) {
    controlStyle.fontSize = "24px";
    controlStyle.padding = "12px";
  } else if (windowWidth >= 1024) {
    controlStyle.fontSize = "32px";
    controlStyle.padding = "16px";
  }

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "19%",
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // const getScale = (index) => (index === activeSlide ? 1.1 : 0.9);
  const getScale = (index) => {
  if (index === activeSlide) {
    return windowWidth >= 640 ? 1.1 : 1.1; // Skala 1.1 untuk laptop, 1 untuk mobile
  } else {
    return windowWidth >= 640 ? 0.9 : 0; // Skala 0.9 untuk laptop, 0.2 untuk mobile
  }
};

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const handleNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className="lg:w-full lg:h-fit sm:w-30 sm:h-20 relative overflow-hidden">
      <Slider
      ref={sliderRef}
      style={sliderStyle}
      {...settings}
      afterChange={handleSlideChange}
    >
      <div style={slideStyle}>
        <img
          src={image1}
          alt="Image 1"
          className="w-full h-auto mx-auto"
          style={{
            transform: `scale(${getScale(0)})`,
            maxWidth: "100%",
            height: windowWidth < 640 ? "150px" : "auto",
            width: windowWidth < 640 ? "900px" : "auto",
            display:"table"
          }}
        />
      </div>
      <div style={slideStyle}>
        <img
          src={image2}
          alt="Image 2"
          className="w-full h-auto mx-auto"
          style={{
            transform: `scale(${getScale(1)})`,
            maxWidth: "auto",
            height: windowWidth < 640 ? "150px" : "auto",
            width: windowWidth < 640 ? "900px" : "auto",
            display:"table"
          }}
        />
      </div>
      <div style={slideStyle} >
        <img
          src={image3}
          alt="Image 3"
          className="w-full h-auto mx-auto"
          style={{
            transform: `scale(${getScale(2)})`,
            maxWidth: "100%",
            height: windowWidth < 640 ? "150px" : "auto",
            width: windowWidth < 640 ? "900px" : "auto",
            display:"table"
          }}
        />
      </div>
    </Slider>
      {windowWidth >= 640 && (
        <>
          <div style={{ ...controlStyle, left: "10%" }} onClick={handlePrevSlide}>
            <ChevronLeftIcon  className="items-center text-teal-500" />
          </div>
          <div style={{ ...controlStyle, right: "10%" }} onClick={handleNextSlide}>
            <ChevronRightIcon className="items-center text-teal-500" style={{ fontSize: "30px" }} />
          </div>
        </>
       )}
    </div>
  );
}

export default SlideShow;
