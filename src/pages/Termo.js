import { useTermContext } from "@/TermContext";
import { useState, useRef, useEffect } from "react";
import { IoBackspaceOutline as Backspace } from "react-icons/io5";

export function Termo() {
  const str = "ilelo";
  const letters = str.replace(/[^a-z]/gi, "").length; // Calcula o número de letras
  const boxes = Array.from({ length: letters }, (_, index) => index);
  const [activeBox, setActiveBox] = useState(0);
  const [values, setValues] = useState(Array(letters).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Define o foco na caixa ativa
    if (inputRefs.current[activeBox]) {
      inputRefs.current[activeBox].focus();
    }
  }, [activeBox]);

  const handleKeyDown = (index) => (event) => {
    const { key } = event;

    if (key === "ArrowRight") {
      event.preventDefault();
      // Navegação circular para a direita
      const nextIndex = (index + 1) % letters;
      setActiveBox(nextIndex);
      inputRefs.current[nextIndex].focus();
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      // Navegação circular para a esquerda
      const prevIndex = (index - 1 + letters) % letters;
      setActiveBox(prevIndex);
      inputRefs.current[prevIndex].focus();
    } else if (key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    } else if (key === "Enter") {
      event.preventDefault();
      handleAlphabetClick("\n")();
    } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      event.preventDefault();
      handleAlphabetClick(key)();
    }
  };

  const handleBackspace = () => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;

      // Remove o caractere da caixa ativa, se houver
      if (newValues[currentIndex] !== "") {
        newValues[currentIndex] = "";
      } else {
        // Caso a caixa ativa esteja vazia, move para a caixa anterior não vazia
        while (currentIndex > 0 && newValues[currentIndex] === "") {
          currentIndex--;
        }

        if (newValues[currentIndex] !== "") {
          newValues[currentIndex] = "";
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

  const handleAlphabetClick = (letter) => () => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      let currentIndex = activeBox;

      // Preenche a caixa ativa e move o foco para a próxima caixa
      if (currentIndex < letters) {
        newValues[currentIndex] = letter;
        currentIndex++;
      }

      // Encontrar o próximo campo vazio mais próximo para o foco
      let newActiveIndex = currentIndex;
      while (newActiveIndex < letters && newValues[newActiveIndex] !== "") {
        newActiveIndex++;
      }

      // Se há um campo vazio, definir o próximo campo vazio como ativo
      if (newActiveIndex < letters) {
        setActiveBox(newActiveIndex);
      } else {
        // Caso todos os campos estejam preenchidos, mantenha o foco na última caixa
        setActiveBox(Math.min(currentIndex, letters - 1));
      }

      // Foco no novo índice ativo
      if (inputRefs.current[newActiveIndex]) {
        inputRefs.current[newActiveIndex].focus();
      }

      return newValues;
    });
  };

  // Layout do teclado QWERTY com Backspace e Enter
  const extendedQwertyLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
    ["z", "x", "c", "v", "b", "n", "m", "enter"],
  ];

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-6 w-full bg-emerald-700
      }`}
    >
          <h1 className="uppercase text-4xl font-black text-gray-200 mb-6">
           Termo
          </h1>
          <div
            className={`grid grid-cols-1 w-full justify-stretch`}
          >
            {Array.from({ length: 1 }).map((_, nIndex) => (
              <div key={nIndex}>
                <div className="flex justify-center gap-1">
                  {boxes.map((box) => (
                    <input
                      key={box}
                      ref={(el) => (inputRefs.current[box] = el)} // Atribui a referência ao input
                      type="text"
                      maxLength={1}
                      value={values[box]}
                      onClick={() => setActiveBox(box)}
                      onKeyDown={handleKeyDown(box)}
                      className={`text-4xl uppercase font-black border-black bg-emerald-600 text-center w-16 h-16 text-white flex items-center justify-center rounded-lg mb-1 transform transition-transform duration-300 caret-transparent ease-in-out cursor-pointer
                      ${activeBox === box && "border-b-8"}
                      outline-0 border-2 active:shadow-lg`}
                    />
                  ))}
                </div>
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <div
                    key={`disabled-row-${rowIndex}`}
                    className="flex justify-center gap-1"
                  >
                    {Array.from({ length: 5 }).map((_, colIndex) => (
                      <input
                        key={`disabled-${rowIndex}-${colIndex}`}
                        type="text"
                        maxLength={1}
                        value="" // Sem valor
                        disabled
                        className={`uppercase font-black border-transparent text-center w-16 h-16 text-gray-400 flex items-center justify-center rounded-md transform transition-transform duration-300 caret-transparent ease-in-out cursor-not-allowed  bg-emerald-900 outline-0 border-2 opacity-35 mb-1`}
                      />
                    ))}
                  </div>
                ))}
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
                      onClick={handleBackspace}
                      className={`text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800`}
                    >
                      <Backspace />
                    </button>
                  ) : key === "enter" ? (
                    <button
                      key={key}
                      onClick={handleAlphabetClick("\n")}
                      className={`text-white py-4 px-6 rounded bg-emerald-900 hover:bg-emerald-800`}
                    >
                      Enter
                    </button>
                  ) : (
                    <button
                      key={key}
                      onClick={handleAlphabetClick(key)}
                      className={`uppercase font-black text-white py-4 px-6 rounded  bg-emerald-900 hover:bg-emerald-800`}
                    >
                      {key}
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
    </main>
  );
}
