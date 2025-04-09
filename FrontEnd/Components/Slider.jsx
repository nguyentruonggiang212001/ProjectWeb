import { useState, useEffect, useRef } from "react";
import slider1 from "../img/slider1.webp";
import slider2 from "../img/slider2.webp";
import slider3 from "../img/slider3.webp";
import "../css/style.css";
import "../css/grid.css";

const Slider = () => {
  const [currSlide, setCurrSlide] = useState(0);
  const dotsRef = useRef([]);

  const dataSlide = [
    { id: 1, image: slider1 },
    { id: 2, image: slider2 },
    { id: 3, image: slider3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrSlide((prevSlide) => (prevSlide + 1) % dataSlide.length);
    }, 3000);

    if (dotsRef.current) {
      dotsRef.current.forEach((dot) => (dot.style.backgroundColor = "white"));
      if (dotsRef.current[currSlide]) {
        dotsRef.current[currSlide].style.backgroundColor = "red";
      }
    }

    return () => clearInterval(interval);
  }, [currSlide, dataSlide.length]);

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {dataSlide.map((slide, index) => (
          <div
            key={slide.id}
            className="slide"
            style={{ display: index === currSlide ? "block" : "none" }}
          >
            <img src={slide.image} alt={`Slide ${slide.id}`} />
          </div>
        ))}
      </div>

      <div className="control">
        <button
          className="prev"
          onClick={() =>
            setCurrSlide((currSlide - 1 + dataSlide.length) % dataSlide.length)
          }
        >
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <button
          className="next"
          onClick={() => setCurrSlide((currSlide + 1) % dataSlide.length)}
        >
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>

      <div className="process">
        {dataSlide.map((_, index) => (
          <div
            key={index}
            className="dot"
            ref={(el) => (dotsRef.current[index] = el)}
            onClick={() => setCurrSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
