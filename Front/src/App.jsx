import ChatGroups from "./Components/ChatGroups";
import Header from "./Components/Header";
import User from "./Components/User";
import Log from "./Components/Log";

export default function App() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-black dark:text-white">
      <Header />
      <div className="flex w-full h-full">
        <div className="w-[20%] dark:bg-secondary bg-secondary_light">
          <ChatGroups />
          <User />
        </div>
        <div className="w-[80%] dark:bg-background bg-background_light border-l-4 dark:border-l-primary border-l-primary_light">
          <Log />
        </div>
      </div>
    </section>
  );
}
