import ChatGroups from "./Components/ChatGroups";
import Header from "./Components/Header";
import User from "./Components/User";
import Log from "./Components/Log";

import { useScreenContext } from "./Providers/ScreenProvider";

import { useEffect, useState } from "react";

export default function App() {
  const isSmallScreen = useScreenContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isSmallScreen) {
      setShow(false);
    }
  }, [isSmallScreen]);

  return (
    <section className="h-screen min-h-[800px] overflow-hidden flex flex-col justify-center items-center text-black dark:text-white">
      <div className="w-full h-[8%] min-h-[80px]">
        <Header show={show} setShow={setShow} />
      </div>
      <div className="flex w-full h-[92%] dark:bg-background bg-background_light">
        <div
          className={`${
            isSmallScreen
              ? `transform transition-all duration-500 ease-in-out ${
                  show
                    ? "translate-x-0 w-[40%] opacity-100"
                    : "-translate-x-full w-[0%] opacity-0"
                }`
              : "w-[20%] opacity-100"
          } dark:bg-secondary bg-secondary_light`}
        >
          <ChatGroups setShow={setShow} />
          <User />
        </div>

        <div
          className={`${
            isSmallScreen ? "w-[100%]" : "w-[80%]"
          } dark:bg-background bg-background_light overflow-hidden`}
        >
          <Log />
        </div>
      </div>
    </section>
  );
}
