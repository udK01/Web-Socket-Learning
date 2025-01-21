import React, { useState } from "react";

const Hamburger = ({ show, setShow }) => {
  return (
    <button
      className="relative flex flex-col justify-between w-8 h-8 group"
      onClick={() => setShow(!show)}
      aria-label="Toggle Menu"
    >
      {/* Top bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-transform duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          show ? "rotate-45 translate-y-3.5" : ""
        }`}
      ></span>
      {/* Middle bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-all duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          show ? "opacity-0" : ""
        }`}
      ></span>
      {/* Bottom bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-transform duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          show ? "-rotate-45 -translate-y-3.5" : ""
        }`}
      ></span>
    </button>
  );
};

export default Hamburger;
