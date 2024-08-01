import { useState, useRef, useEffect } from "react";
import { IoBackspaceOutline as Backspace } from "react-icons/io5";

export function Termo() {
  const str = "ilelo";
  const letters = str.replace(/[^a-z]/gi, "").length; // Calcula o número de letras
  const boxes = Array.from({ length: letters }, (_, index) => index);
  const [activeBox, setActiveBox] = useState(0);
  const [actualEnabled, setActualEnabled] = useState(0);
  const [values, setValues] = useState(Array.from({ length: 7 }, () => Array(letters).fill(""))); // Ajustado para múltiplas linhas
  const inputRefs = useRef([]);

  useEffect(() => {
    // Define o foco na caixa ativa
    if (inputRefs.current[activeBox]) {
      inputRefs.current[activeBox].focus();
    }
  }, [activeBox]);

  const handleKeyDown = (index, row) => (event) => {
    const { key } = event;

    if (key === "ArrowRight") {
      event.preventDefault();
      // Navegação circular para a direita
      const nextIndex = (index + 1) % letters;
      setActiveBox(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      // Navegação circular para a esquerda
      const prevIndex = (index - 1 + letters) % letters;
      setActiveBox(prevIndex);
      inputRefs.current[prevIndex]?.focus();
    } else if (key === "Backspace") {
      event.preventDefault();
      handleBackspace(row);
    } else if (key === "Enter") {
      event.preventDefault();
      handleAlphabetClick("\n")(row);
    } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      event.preventDefault();
      handleAlphabetClick(key)(row);
    }
  };

  const handleBackspace = (row) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;

      // Remove o caractere da caixa ativa, se houver
      if (newValues[row][currentIndex] !== "") {
        newValues[row][currentIndex] = "";
      } else {
        // Caso a caixa ativa esteja vazia, move para a caixa anterior não vazia
        while (currentIndex > 0 && newValues[row][currentIndex] === "") {
          currentIndex--;
        }

        if (newValues[row][currentIndex] !== "") {
          newValues[row][currentIndex] = "";
        }
      }
      // Atualiza o foco para a caixa atual
      setActiveBox(currentIndex);
      if (inputRefs.current[currentIndex]) {
        inputRefs.current[currentIndex].focus();
      }
      return newValues;
    });
  };

  const handleAlphabetClick = (letter) => (row) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;
      if (currentIndex < letters) {
        newValues[row][currentIndex] = letter;
        currentIndex++;
      }
      let newActiveIndex = currentIndex;
      while (newActiveIndex < letters && newValues[row][newActiveIndex] !== "") {
        newActiveIndex++;
      }
      if (newActiveIndex < letters) {
        setActiveBox(newActiveIndex);
      } else {
        setActiveBox(Math.min(currentIndex, letters - 1));
      }
      if (inputRefs.current[newActiveIndex]) {
        inputRefs.current[newActiveIndex]?.focus();
      }
      return newValues;
    });
  };

  const extendedQwertyLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
    ["z", "x", "c", "v", "b", "n", "m", "enter"],
  ];

  const handleSubmit = () => {
    setActualEnabled((prev) => (prev + 1) % 7); // Círculo entre 0 e 6
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 w-full bg-emerald-700">
      <h1 className="uppercase text-4xl font-black text-gray-200 mb-6">Termo</h1>
      <div className="grid grid-cols-1 w-full justify-stretch">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={rowIndex}>
            <div className="flex justify-center gap-1">
              {boxes.map((box) => (
                <input
                  key={`${rowIndex}-${box}`} // Garantir chave única
                  ref={(el) => (inputRefs.current[box] = el)}
                  type="text"
                  maxLength={1}
                  value={values[rowIndex][box]}
                  onClick={() => setActiveBox(box)}
                  onKeyDown={handleKeyDown(box, rowIndex)}
                  disabled={actualEnabled !== rowIndex}
                  className={`text-4xl uppercase font-black border-black ${actualEnabled !== rowIndex ? "bg-emerald-900" : "bg-emerald-600"} text-center w-16 h-16 text-white flex items-center justify-center rounded-lg mb-1 transition-transform duration-300 caret-transparent ease-in-out cursor-pointer
                    ${activeBox === box && "border-b-8"}
                    outline-0 border-2 active:shadow-lg`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xl mt-6 space-y-2 w-full">
        {extendedQwertyLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {row.map((key) =>
              key === "backspace" ? (
                <button
                  key={key}
                  onClick={() => handleBackspace(actualEnabled)}
                  className="text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  <Backspace />
                </button>
              ) : key === "enter" ? (
                <button
                  key={key}
                  type="submit"
                  onClick={handleSubmit}
                  className="text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  Enter
                </button>
              ) : (
                <button
                  key={key}
                  onClick={() => handleAlphabetClick(key)(actualEnabled)}
                  className="uppercase font-black text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800"
                >
                  {key}
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
