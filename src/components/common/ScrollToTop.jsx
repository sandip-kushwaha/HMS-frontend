import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window
    window.scrollTo(0, 0);

    // Scroll common containers
    const containers = document.querySelectorAll(
      "main, .overflow-y-auto, .overflow-auto",
    );

    containers.forEach((container) => {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
