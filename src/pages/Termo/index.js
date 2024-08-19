import React, { useState, useRef, useEffect } from "react";
import InputBox from "./InputBox";
import Keyboard from "./Keyboard";
import { Word } from "@andsfonseca/palavras-pt-br";

export function Termo() {
  const [randomWord, setRandomWord] = useState("");
  const [normalWord, setNormalWord] = useState("");
  const [lettersWord, setLettersWord] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const randomWord = Word.getRandomWord(5); // Obtém palavra aleatória com 5 letras
      const normalWord = randomWord
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      setNormalWord(randomWord);
      setLettersWord(normalWord.split(""));
      setRandomWord(normalWord);
    }
  }, []);

  const strNormal = normalWord;
  const str = randomWord;
  const [isCorrect, setIsCorrect] = useState(
    Array.from({ length: 6 }, () => null)
  );
  const [oneCorrect, setOneCorrect] = useState(false);
  const [strRepeatLetters, setStrRepeatLetters] = useState(false);
  const letters = str.replace(/[^a-z]/gi, "").length;
  const boxes = Array.from({ length: 5 }, (_, index) => index); // Sempre 5 caixas
  const [activeBox, setActiveBox] = useState(0);
  const [actualEnabled, setActualEnabled] = useState(0);
  const [values, setValues] = useState(
    Array.from({ length: 6 }, () => Array(letters).fill(""))
  );
  const [usedRows, setUsedRows] = useState(new Set());
  const [matchedLetters, setMatchedLetters] = useState([]);
  const [matchedPositions, setMatchedPositions] = useState([]);
  const [incorrectLetters, setIncorrectLetters] = useState(
    Array.from({ length: 6 }, () => [])
  );
  const inputRefs = useRef([]);

  // Verificar se a string contém letras repetidas
  const checkForRepeatedLetters = () => {
    const seen = new Set();
    for (let char of str.toLowerCase()) {
      if (seen.has(char)) {
        setStrRepeatLetters(true);
        return;
      }
      seen.add(char);
    }
    setStrRepeatLetters(false);
  };

  // Inicializar verificação de letras repetidas
  useEffect(() => {
    checkForRepeatedLetters();
  }, []);

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
    setActualEnabled((prev) => (prev + 1) % 6);

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
    const positions = str
      .split("")
      .map((letter, index) => ({ letter, position: index }));
    setMatchedPositions(positions);

    if (currentRowText === str) {
      handleCorrectRow(actualEnabled);
      alert('A linha corresponde a "termo"!');
      setOneCorrect(true);
    } else {
      // Identificar letras incorretas na linha
      const incorrect = str
        .split("")
        .filter((letter) => !currentRowText.includes(letter));
      setIncorrectLetters((prevIncorrectLetters) => {
        const newIncorrectLetters = [...prevIncorrectLetters];
        newIncorrectLetters[actualEnabled] = incorrect;
        return newIncorrectLetters;
      });

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
        alert('A linha não corresponde a "termo"!');
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
    <div className="bg-emerald-700 flex flex-col w-screen h-screen">
      {/* Container principal que garante a ocupação máxima */}
      <div className="flex flex-col flex-grow w-full">
        {/* Container para os input boxes */}
        <div className="h-[70vh] flex flex-col flex-grow overflow-hidden p-3">
          <div className="flex flex-col justify-center items-center gap-2 h-full overflow-auto">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
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
                matchedPositions={matchedPositions}
                str={str}
                strNormal={strNormal}
                strRepeatLetters={strRepeatLetters}
                incorrectLetters={incorrectLetters[rowIndex]}
                lettersWord={lettersWord}
              />
            ))}
          </div>
        </div>
        {/* Container para o teclado */}
        <div className="h-[30vh] w-full flex justify-center items-center">
          <Keyboard
            layout={extendedQwertyLayout}
            handleBackspace={() => {
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
    </div>
  );
}
