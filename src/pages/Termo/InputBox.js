import React, { useEffect } from "react";

const InputBox = ({
  str,
  rowIndex,
  boxes,
  values,
  setValues,
  inputRefs,
  activeBox,
  setActiveBox,
  actualEnabled,
  usedRows,
  isCorrect,
  handleCorrectRow,
  oneCorrect,
  matchedPositions, // Estado com as letras e posições corretas
}) => {
  const isUsedRow = usedRows.has(rowIndex);
  const isActiveRow = actualEnabled === rowIndex;

  const generateId = (rowIndex, boxIndex) => `input-${rowIndex}-${boxIndex}`;

  const handleChange = (index, event) => {
    const newValue = event.target.value;

    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[rowIndex][index] = newValue;
      return newValues;
    });
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    const index = boxes.findIndex((box) => box === activeBox);

    if (key === "ArrowRight") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      event.preventDefault();
      handleAlphabetClick(key);
    }
  };

  const moveFocus = (index, direction) => {
    let nextIndex = index + direction;

    if (nextIndex < 0) {
      nextIndex = 0;
    } else if (nextIndex >= boxes.length) {
      nextIndex = boxes.length - 1;
    }

    setActiveBox(nextIndex);

    setTimeout(() => {
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }, 0);
  };

  const handleBackspace = () => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;

      if (newValues[rowIndex][currentIndex] !== "") {
        newValues[rowIndex][currentIndex] = "";
      } else {
        while (currentIndex > 0 && newValues[rowIndex][currentIndex] === "") {
          currentIndex--;
        }
      }

      const newActiveIndex = Math.max(currentIndex, 0);
      setActiveBox(newActiveIndex);

      setTimeout(() => {
        if (inputRefs.current[newActiveIndex]) {
          inputRefs.current[newActiveIndex].focus();
        }
      }, 0);

      return newValues;
    });
  };

  const handleAlphabetClick = (letter) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;
      if (currentIndex < boxes.length) {
        newValues[rowIndex][currentIndex] = letter;
        currentIndex++;
      }

      const newActiveIndex = Math.min(currentIndex, boxes.length - 1);
      setActiveBox(newActiveIndex);
      setTimeout(() => {
        if (inputRefs.current[newActiveIndex]) {
          inputRefs.current[newActiveIndex].focus();
        }
      }, 0);

      return newValues;
    });
  };

  useEffect(() => {
    if (
      isCorrect ===
      `input-${rowIndex}-${boxes.find(
        (box) => values[rowIndex][box] === "ilelo"
      )}`
    ) {
      handleCorrectRow(rowIndex);
    }
  }, [values]);

  useEffect(() => {
    if (inputRefs.current[activeBox]) {
      setTimeout(() => inputRefs.current[activeBox].focus(), 0);
    }
  }, [activeBox]);

  return (
    <div>
      <div className="flex justify-center gap-1">
        {boxes.map((box) => (
          <input
            key={`${rowIndex}-${box}`}
            id={generateId(rowIndex, box)}
            name={generateId(rowIndex, box)}
            ref={(el) => (inputRefs.current[box] = el)}
            type="text"
            maxLength={1}
            value={values[rowIndex][box]}
            onChange={(event) => handleChange(box, event)}
            onClick={() => setActiveBox(box)}
            onKeyDown={handleKeyDown}
            disabled={actualEnabled !== rowIndex || oneCorrect}
            className={`text-4xl uppercase font-black border-black ${
              isActiveRow
                ? "bg-emerald-600"
                : isUsedRow
                ? isCorrect
                  ? "bg-green-500"
                  : matchedPositions.some((pos) => {
                      const letter = values[rowIndex][box].toLowerCase();
                      return pos.position !== box && pos.letter === letter;
                    })
                  ? "bg-yellow-300"
                  : "bg-teal-950"
                : "bg-emerald-900 opacity-25 brightness-50"
            } ${
              oneCorrect &&
              !isCorrect &&
              isActiveRow &&
              "bg-emerald-900 opacity-25 brightness-50"
            } text-center w-16 h-16 text-white flex items-center justify-center rounded-lg mb-1 transition-transform duration-300 caret-transparent ease-in-out cursor-pointer ${
              !oneCorrect && isActiveRow && activeBox === box
                ? "border-b-8"
                : ""
            } outline-0 border-2 active:shadow-lg ${
              !isActiveRow &&
              matchedPositions.some(
                (pos) =>
                  pos.position === box &&
                  pos.letter === values[rowIndex][box].toLowerCase()
              )
                ? "bg-green-500"
                : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InputBox;
