import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useWebSocket } from "../WebSocketProvider";

export default function ChatGroups() {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groupRef = useRef(null);

  const { ws } = useWebSocket();

  useEffect(() => {
    if (ws) {
      const handleMessage = ({ data }) => {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "groups") {
          setGroups(parsedData.groups);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws]);

  const DisplayGroup = ({ imgSrc, groupName }) => {
    return (
      <div className="h-[10%] flex items-center gap-5 py-2 px-4 border-b-2 border-slate-800 hover:cursor-pointer hover:bg-slate-800 transition-colors duration-300">
        <img src={imgSrc} />
        <div className="text-[20px] line-clamp-1 text-ellipsis">
          {groupName}
        </div>
      </div>
    );
  };

  const CreateGroupUI = () => {
    return (
      <div className="absolute min-w-[200px] bg-[#302c34] w-[15%] flex flex-col justify-center items-center ring-4 rounded-md ring-[#1c1c1c]">
        <input
          ref={groupRef}
          placeholder="Group Name"
          className="w-[90%] h-fit text-center rounded-md bg-transparent m-3 ring-2 placeholder-white ring-[#1c1c1c]"
        />
        <div className="w-full flex justify-between px-1">
          <button
            className="bg-purple-500 rounded-md py-1 m-2 px-5 hover:cursor-pointer hover:bg-purple-700 transition-colors duration-300"
            onClick={() => setShowCreate(false)}
          >
            Back
          </button>
          <button
            className="bg-orange-500 rounded-md py-1 m-2 px-5 hover:cursor-pointer hover:bg-orange-700 transition-colors duration-300"
            onClick={() => createGroup()}
          >
            Create
          </button>
        </div>
      </div>
    );
  };

  function createGroup() {
    setShowCreate(false);
    let groupName = groupRef.current.value;

    if (groupName.trim()) {
      ws.send(
        JSON.stringify({
          type: "create_group",
          groupName,
        })
      );
    }
  }

  return (
    <div className="w-full h-[90%] flex flex-col text-white overflow-auto scrollbar-none">
      {groups &&
        groups.map((group, i) => (
          <DisplayGroup
            key={i}
            imgSrc={group.groupImg}
            groupName={group.groupName}
          />
        ))}
      <div className="flex justify-center items-center space-y-40">
        <CiCirclePlus
          className="text-[48px] hover:cursor-pointer hover:text-orange-500 transition-colors duration-300"
          onClick={() => setShowCreate(true)}
        />
        {showCreate && <CreateGroupUI />}
      </div>
    </div>
  );
}
