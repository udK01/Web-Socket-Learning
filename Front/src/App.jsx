import SendMessage from "./Components/SendMessage";
import ChatGroups from "./Components/ChatGroups";
import User from "./Components/User";
import Log from "./Components/Log";

export default function App() {
  return (
    <section className="h-screen bg-slate-600 flex flex-col justify-center items-center">
      <div className="flex w-[40%] h-[60%]">
        <div className="w-[30%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <ChatGroups />
          <User />
        </div>
        <div className="w-[70%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <Log />
        </div>
      </div>
    </section>
  );
}
