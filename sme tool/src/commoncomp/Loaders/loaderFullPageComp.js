import React from "react";
import "./loaderComp.css";
const LoaderFullPageComp = () => {

  return (
    <>
    <div class="overlay">
    <div class="overlay__inner">
        <div class="overlay__content"><span class="spinner"></span></div>
        </div>
    </div>
    </>
  );
};

export default LoaderFullPageComp;
