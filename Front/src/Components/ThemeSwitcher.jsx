import { useTheme } from "../Providers/ThemeProvider";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const setDeviceTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div>
      <button onClick={toggleTheme}>Toggle Theme ({theme})</button>
      <button onClick={setDeviceTheme}>Use Device Theme</button>
    </div>
  );
};

export default ThemeSwitcher;
