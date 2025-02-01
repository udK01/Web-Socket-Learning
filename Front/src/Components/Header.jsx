import { useScreenContext } from "../Providers/ScreenProvider";
import { useGroup } from "../Providers/GroupProvider";

import ThemeSwitcher from "./ThemeSwitcher";
import GoogleAuth from "./GoogleAuth";
import Hamburger from "./Hamburger";

export default function Header({ show, setShow }) {
  const { selectedGroup } = useGroup();
  const isSmallScreen = useScreenContext();

  return (
    <div className="w-full h-[80px] flex items-center bg-primary_light dark:bg-primary">
      <div
        className={`${
          isSmallScreen ? "w-[30%]" : "w-[20%]"
        } flex justify-center items-center px-10`}
      >
        {isSmallScreen && <Hamburger show={show} setShow={setShow} />}
      </div>

      <div
        className={`${
          isSmallScreen ? "w-[70%]" : "w-[80%]"
        } text-[32px] line-clamp-1`}
      >
        <div className="flex w-full justify-between px-4">
          <div className="w-[70%] overflow-hidden whitespace-nowrap text-ellipsis">
            {selectedGroup && selectedGroup.groupName}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
