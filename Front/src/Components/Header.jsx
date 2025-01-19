import { useState } from "react";

import { useGroup } from "../Providers/GroupProvider";

import GoogleAuth from "./GoogleAuth";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const { selectedGroup } = useGroup();

  return (
    <div className="w-full h-[80px] flex items-center bg-primary text-white">
      <div className="w-[20%] flex justify-center items-center">
        <GoogleAuth />
        <ThemeSwitcher />
      </div>
      <div className="w-[80%] text-[32px] line-clamp-1">
        {selectedGroup && selectedGroup.groupName}
      </div>
    </div>
  );
}
