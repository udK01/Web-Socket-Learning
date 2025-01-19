import ThemeSwitcher from "./Components/ThemeSwitcher";
import GoogleAuth from "./Components/GoogleAuth";
import ChatGroups from "./Components/ChatGroups";
import Header from "./Components/Header";
import User from "./Components/User";
import Log from "./Components/Log";

export default function App() {
  return (
    <section className="h-screen flex flex-col justify-center items-center border-4 border-primary">
      {/* <ThemeSwitcher />
      <GoogleAuth /> */}
      <Header />
      <div className="flex w-full h-full">
        <div className="w-[20%] bg-secondary ">
          <ChatGroups />
          <User />
        </div>
        <div className="w-[80%] bg-background ring-4 ring-primary">
          <Log />
        </div>
      </div>
    </section>
  );
}
