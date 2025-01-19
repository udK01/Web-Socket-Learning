import { useTheme } from "../Providers/ThemeProvider";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <div className="w-11 h-6 bg-gray-300 dark:bg-tertiary rounded-full flex items-center transition-colors duration-300">
          <div
            className={`w-5 h-5 bg-white dark:bg-accent rounded-full shadow transform transition-transform duration-300 ${
              theme === "dark" ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
