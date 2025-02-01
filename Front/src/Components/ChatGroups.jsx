import { useRef, useState } from "react";
import { ImBin } from "react-icons/im";

import { useWebSocket } from "../Providers/WebSocketProvider";
import { useGroup } from "../Providers/GroupProvider";
import { useUser } from "../Providers/UserProvider";

export default function ChatGroups({ setShow }) {
  const { groups, selectedGroup, setSelectedGroup } = useGroup();

  const [showCreate, setShowCreate] = useState(false);
  const groupRef = useRef(null);

  const { ws } = useWebSocket();
  const { userID } = useUser();

  const DisplayGroup = ({ group }) => {
    return (
      <div
        className={`h-16 flex items-center justify-between border-b-4 dark:border-primary border-primary_light hover:cursor-pointer dark:hover:bg-primary hover:bg-primary_light transition-colors duration-300 ${
          group._id === selectedGroup?._id
            ? "dark:bg-primary bg-primary_light"
            : ""
        }`}
        onClick={() => {
          setSelectedGroup(group);
          setShow(false);
        }}
      >
        <div className="flex gap-2 py-2 px-4">
          <img src={group.groupImg} className="flex flex-shrink-0" />
          <div className="text-[20px] truncate max-w-full overflow-hidden">
            {group.groupName}
          </div>
        </div>

        {group.groupOwner === userID && (
          <div
            className="h-full w-[10%] bg-red-500 flex flex-shrink-0 rounded-l-md justify-center items-center hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              deleteGroup(group);
            }}
          >
            <ImBin className="text-[16px]" />
          </div>
        )}
      </div>
    );
  };

  const CreateGroupUI = () => {
    return (
      <div className="absolute top-0 left-0 flex justify-center items-center w-screen h-full dark:bg-tertiary/50 bg-primary_light/50">
        <div className="absolute min-w-[300px] dark:bg-secondary bg-secondary_light size-[20%] flex flex-col justify-center items-center ring-4 rounded-md dark:ring-tertiary ring-tertiary_light">
          <div>
            <input
              ref={groupRef}
              placeholder="Group Name"
              className="w-[90%] h-fit text-center rounded-md bg-transparent m-3 ring-2 dark:placeholder-white placeholder-black dark:ring-tertiary ring-tertiary_light"
            />
            <div className="w-full flex justify-between px-1">
              <button
                className="bg-purple-500 rounded-md py-1 m-2 px-5 hover:cursor-pointer dark:hover:bg-accent hover:bg-accent_light transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCreate(false);
                }}
              >
                Back
              </button>
              <button
                className="bg-orange-500 rounded-md py-1 m-2 px-5 hover:cursor-pointer hover:bg-orange-700 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  createGroup();
                }}
              >
                Create
              </button>
            </div>
          </div>
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

  function deleteGroup(group) {
    ws.send(
      JSON.stringify({
        type: "delete_group",
        group,
      })
    );

    if (selectedGroup._id === group._id) {
      ws.send(
        JSON.stringify({
          type: "clear_selected",
        })
      );
    }
  }

  return (
    <div className="w-full h-[90%] flex flex-col justify-between">
      <div className="overflow-auto scrollbar-none">
        {groups &&
          groups.map((group, i) => <DisplayGroup key={i} group={group} />)}
      </div>
      <div
        className="flex justify-center items-center dark:bg-primary bg-primary_light dark:hover:bg-accent hover:bg-accent_light font-extrabold hover:cursor-pointer"
        onClick={() => setShowCreate(true)}
      >
        <div className="xl:text-[32px] md:text-[24px] my-4 line-clamp-1">
          Create Group
        </div>
        {showCreate && <CreateGroupUI />}
      </div>
    </div>
  );
}
