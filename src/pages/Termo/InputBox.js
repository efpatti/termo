import React, { useEffect, useState, useRef } from "react";

const InputBox = ({
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
  matchedPositions,
  str,
  strNormal,
  lettersWord,
}) => {
  const isUsedRow = usedRows.has(rowIndex);
  const isActiveRow = actualEnabled === rowIndex;
  const [currentDisplay, setCurrentDisplay] = useState(values[rowIndex]);
  const [count, setCount] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  // Ref to keep track of interval
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && count < 4) {
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => Math.min(prevCount + 1, 4));
      }, 500);
    } else if (!isActive || count >= 4) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (oneCorrect) {
      setIsActive(true);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, oneCorrect, count]);

  const generateId = (rowIndex, boxIndex) => `input-${rowIndex}-${boxIndex}`;

  const handleChange = (index, event) => {
    const newValue = event.target.value.toUpperCase();

    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[rowIndex][index] = newValue;
      return newValues;
    });

    setCurrentDisplay(values[rowIndex]);
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
      handleAlphabetClick(key.toUpperCase());
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

    setCurrentDisplay(values[rowIndex]);
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

    setCurrentDisplay(values[rowIndex]);
  };

  // Determine a cor do fundo com base na letra e sua posição
  const getBackgroundColor = (boxIndex) => {
    const currentLetter = values[rowIndex][boxIndex].toLowerCase();
    const correctPosition = matchedPositions.find(
      (pos) => pos.position === boxIndex && pos.letter === currentLetter
    );
    if (isCorrect) {
      return "bg-emerald-600";
    }
    if (correctPosition) {
      return "ease-in-out duration-300 transition-all bg-green-500"; // letra correta na posição correta
    } else if (matchedPositions.some((pos) => pos.letter === currentLetter)) {
      return "bg-yellow-300"; // letra correta na posição errada
    } else {
      return "bg-emerald-900 opacity-25 brightness-50"; // letra incorreta
    }
  };

  useEffect(() => {
    if (isCorrect === `input-${rowIndex}-${str}`) {
      handleCorrectRow(rowIndex);
    }
  }, [values]);

  useEffect(() => {
    if (inputRefs.current[activeBox]) {
      setTimeout(() => inputRefs.current[activeBox].focus(), 0);
    }
  }, [activeBox]);

  // Cria uma lista de letras únicas baseada na string normalizada e no comprimento dos inputs
  const uniqueLettersWord = React.useMemo(() => {
    // Remove letras duplicadas e retorna exatamente o número necessário de letras
    const uniqueLetters = [...new Set(strNormal.split(""))];
    return uniqueLetters.slice(0, boxes.length); // Garante que tenha o número correto de letras
  }, [strNormal, boxes.length]);

  return (
    <div>
      <div className="flex justify-center gap-1">
        {boxes.map((box, index) => (
          <React.Fragment key={index}>
            <input
              id={generateId(rowIndex, box)}
              name={generateId(rowIndex, box)}
              ref={(el) => (inputRefs.current[box] = el)}
              type="text"
              maxLength={1}
              value={
                count >= box && isCorrect
                  ? uniqueLettersWord[index] || "" // Exibe a letra correspondente
                  : currentDisplay[box] || ""
              }
              onChange={(event) => handleChange(box, event)}
              onClick={() => setActiveBox(box)}
              onKeyDown={handleKeyDown}
              disabled={actualEnabled !== rowIndex || oneCorrect}
              className={`text-4xl uppercase font-black border-black ${
                isActiveRow
                  ? "bg-emerald-600"
                  : isUsedRow
                  ? getBackgroundColor(box)
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
                count >= box &&
                isCorrect &&
                "ease-in-out duration-700 transition-all bg-green-500 transition"
              }`}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InputBox;
