import React from "react";
import { IoBackspaceOutline as Backspace } from "react-icons/io5";

const Keyboard = ({
  layout,
  handleBackspace,
  handleAlphabetClick,
  handleSubmit,
  actualEnabled,
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-2">
          {row.map((key) => {
            if (key === "backspace") {
              return (
                <button
                  key={key}
                  onClick={() => handleBackspace(actualEnabled)}
                  className="text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  <Backspace />
                </button>
              );
            } else if (key === "enter") {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={handleSubmit}
                  className="text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  Enter
                </button>
              );
            } else {
              return (
                <button
                  key={key}
                  onClick={() => handleAlphabetClick(key)(actualEnabled)}
                  className="uppercase font-black text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  {key}
                </button>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
