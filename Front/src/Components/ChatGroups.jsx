import { CiCirclePlus } from "react-icons/ci";

export default function ChatGroups() {
  const DisplayGroup = ({ imgSrc, groupName }) => {
    return (
      <div className="h-[10%] flex justify-center items-center gap-5 p-2 border-b-2 border-slate-800 hover:cursor-pointer hover:bg-slate-800 transition-colors duration-300">
        <img src={imgSrc} />
        <div className="text-[20px]">{groupName}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-[90%] flex flex-col text-white overflow-auto scrollbar-none">
      <DisplayGroup imgSrc={"./vite.svg"} groupName={"Group 1"} />
      <DisplayGroup imgSrc={"./vite.svg"} groupName={"Group 2"} />
      <DisplayGroup imgSrc={"./vite.svg"} groupName={"Group 3"} />

      <div className="flex justify-center items-center">
        <CiCirclePlus className="text-[48px] hover:cursor-pointer hover:text-orange-500 transition-colors duration-300" />
      </div>
    </div>
  );
}
