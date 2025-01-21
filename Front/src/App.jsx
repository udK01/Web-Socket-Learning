import ChatGroups from "./Components/ChatGroups";
import Header from "./Components/Header";
import User from "./Components/User";
import Log from "./Components/Log";
import { useScreenContext } from "./Providers/ScreenProvider";

export default function App() {
  const isSmallScreen = useScreenContext();

  return (
    <section className="h-screen flex flex-col justify-center items-center text-black dark:text-white">
      <div className="w-full h-[8%]">
        <Header />
      </div>
      <div className="flex w-full h-[92%]">
        {isSmallScreen ? (
          <></>
        ) : (
          <>
            <div className="w-[20%] dark:bg-secondary bg-secondary_light">
              <ChatGroups />
              <User />
            </div>
          </>
        )}
        <div
          className={`${
            isSmallScreen ? "w-full" : "w-[80%]"
          } dark:bg-background bg-background_light border-l-4 dark:border-l-primary border-l-primary_light`}
        >
          <Log />
        </div>
      </div>
    </section>
  );
}
