import React, { useState, useRef } from "react";
import InputBox from "./InputBox";
import Keyboard from "./Keyboard";

export function Termo() {
  const str = "termo";
  const [isCorrect, setIsCorrect] = useState(
    Array.from({ length: 7 }, () => null)
  );
  const [oneCorrect, setOneCorrect] = useState(false);
  const letters = str.replace(/[^a-z]/gi, "").length;
  const boxes = Array.from({ length: letters }, (_, index) => index);
  const [activeBox, setActiveBox] = useState(0);
  const [actualEnabled, setActualEnabled] = useState(0);
  const [values, setValues] = useState(
    Array.from({ length: 7 }, () => Array(letters).fill(""))
  );
  const [usedRows, setUsedRows] = useState(new Set());
  const [matchedLetters, setMatchedLetters] = useState([]); // Estado para armazenar as letras que coincidem com str
  const [matchedPositions, setMatchedPositions] = useState([]); // Estado para armazenar as letras e suas posições corretas
  const inputRefs = useRef([]);

  const handleAlphabetClick = (letter) => (row) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;
      if (currentIndex < letters) {
        newValues[row][currentIndex] = letter;
        currentIndex++;
      }

      const newActiveIndex = Math.min(currentIndex, letters - 1);
      setActiveBox(newActiveIndex);
      if (inputRefs.current[newActiveIndex]) {
        setTimeout(() => inputRefs.current[newActiveIndex].focus(), 0);
      }

      return newValues;
    });
  };

  const handleCorrectRow = (rowIndex) => {
    setIsCorrect((prevIsCorrect) => {
      const newIsCorrect = [...prevIsCorrect];
      newIsCorrect[rowIndex] = `input-${rowIndex}-${values[rowIndex].indexOf(
        str
      )}`;
      return newIsCorrect;
    });
  };

  const handleSubmit = () => {
    setActualEnabled((prev) => (prev + 1) % 7);

    const currentRowValues = values[actualEnabled] || [];
    const currentRowText = currentRowValues.join("").toLowerCase();
    const containsLetter = str
      .split("")
      .some((letter) => currentRowText.includes(letter));

    // Gerar array com as letras que coincidem com str
    const matchedLetters = str
      .split("")
      .filter((letter) => currentRowText.includes(letter));
    setMatchedLetters(matchedLetters);

    // Gerar array com as letras e suas posições corretas em relação a str
    const positions = str.split("").map((letter, index) => ({
      letter,
      position: index,
    }));
    setMatchedPositions(positions);

    if (currentRowText === str) {
      handleCorrectRow(actualEnabled);
      alert('A linha corresponde a "ilelo"!');
      setOneCorrect(true);
    } else {
      if (containsLetter) {
        alert(`A linha contém alguma letra de "${str}"!`);
        setIsCorrect((prevIsCorrect) => {
          const newIsCorrect = [...prevIsCorrect];
          newIsCorrect[actualEnabled] = false;
          return newIsCorrect;
        });
      } else {
        setIsCorrect((prevIsCorrect) => {
          const newIsCorrect = [...prevIsCorrect];
          newIsCorrect[actualEnabled] = false;
          return newIsCorrect;
        });
        alert('A linha não corresponde a "ilelo"!');
      }
    }

    setUsedRows((prevUsedRows) => new Set(prevUsedRows).add(actualEnabled));
  };

  const extendedQwertyLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
    ["z", "x", "c", "v", "b", "n", "m", "enter"],
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 w-full bg-emerald-700">
      <h1 className="uppercase text-4xl font-black text-gray-200 mb-6">
        Termo
      </h1>
      <div className="grid grid-cols-1 w-full justify-stretch">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <InputBox
            key={rowIndex}
            rowIndex={rowIndex}
            boxes={boxes}
            values={values}
            setValues={setValues}
            inputRefs={inputRefs}
            activeBox={activeBox}
            setActiveBox={setActiveBox}
            actualEnabled={actualEnabled}
            usedRows={usedRows}
            isCorrect={isCorrect[rowIndex]}
            handleCorrectRow={handleCorrectRow}
            oneCorrect={oneCorrect}
            matchedLetters={matchedLetters}
            matchedPositions={matchedPositions}
            str={str}
          />
        ))}
      </div>
      <div className="text-xl mt-6 space-y-2 wA-full">
        <Keyboard
          layout={extendedQwertyLayout}
          handleBackspace={(row) => {
            const inputBox = inputRefs.current[activeBox];
            if (inputBox) {
              inputBox.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Backspace" })
              );
            }
          }}
          handleAlphabetClick={handleAlphabetClick}
          handleSubmit={handleSubmit}
          actualEnabled={actualEnabled}
        />
      </div>
    </div>
  );
}
