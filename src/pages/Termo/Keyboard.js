import React, { memo } from "react";
import { IoBackspaceOutline as Backspace } from "react-icons/io5";

const Keyboard = ({
  layout,
  handleBackspace,
  handleAlphabetClick,
  handleSubmit,
  actualEnabled,
}) => {
  // Define button styles and sizes
  const buttonClasses =
    "text-white rounded bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600";

  // Define handlers
  const onClickHandler = (key) => () => {
    if (key === "backspace") {
      handleBackspace();
    } else if (key === "enter") {
      handleSubmit();
    } else {
      handleAlphabetClick(key)(actualEnabled);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      {layout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center gap-1 ${
            row.length === 10
              ? "w-[calc(70%+2rem)] md:w-[calc(50%+4rem)]"
              : "w-[calc(60%+1rem)] md:w-[calc(40%+2rem)]"
          }`}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={onClickHandler(key)}
              className={`${buttonClasses} w-16 h-14 md:w-16 md:h-16 lg:w-14 lg:h-10 xl:w-18 xl:h-18 flex items-center justify-center text-xs md:text-sm lg:text-base p-0 lg:p-3 font-black xl:text-xl`}
            >
              {key === "backspace" ? (
                <Backspace className="text-base md:text-lg lg:text-xl" />
              ) : (
                key.toUpperCase()
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

// Memoize the Keyboard component to prevent unnecessary re-renders
export default memo(Keyboard);
