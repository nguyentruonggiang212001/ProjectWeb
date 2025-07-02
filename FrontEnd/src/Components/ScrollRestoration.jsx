import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};
window.scrollPositions = {};

export default function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions[location.pathname] = window.scrollY;
      window.scrollPositions[location.pathname] = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const savedY = scrollPositions[location.pathname];

    const timeout = setTimeout(() => {
      if (savedY !== undefined) {
        window.scrollTo({
          left: 0,
          top: savedY,
          behavior: "auto",
        });
      } else {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: "auto",
        });
      }
    }, 400);
  }, [location.pathname]);

  return null;
}
