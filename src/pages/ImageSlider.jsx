import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-700 hover:text-black bg-white p-2 rounded-full shadow-md"
    onClick={onClick}
  >
    <ArrowForwardIos fontSize="small" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-gray-700 hover:text-black bg-white p-2 rounded-full shadow-md"
    onClick={onClick}
  >
    <ArrowBackIosNew fontSize="small" />
  </div>
);

const ImageSlider = ({ images = [] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="relative max-w-6xl mx-auto my-6 px-4">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="px-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              {/* <div className="p-2 text-center font-medium text-gray-700">
                Image {index + 1}
              </div> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
