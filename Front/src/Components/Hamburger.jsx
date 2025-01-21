import React, { useState } from "react";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <button
      className="relative flex flex-col justify-between w-8 h-8 group"
      onClick={toggleMenu}
      aria-label="Toggle Menu"
    >
      {/* Top bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-transform duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          isOpen ? "rotate-45 translate-y-3.5" : ""
        }`}
      ></span>
      {/* Middle bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-all duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          isOpen ? "opacity-0" : ""
        }`}
      ></span>
      {/* Bottom bar */}
      <span
        className={`block h-1 w-full bg-tertiary rounded transition-transform duration-300 group-hover:bg-accent_light dark:group-hover:bg-accent ${
          isOpen ? "-rotate-45 -translate-y-3.5" : ""
        }`}
      ></span>
    </button>
  );
};

export default Hamburger;
