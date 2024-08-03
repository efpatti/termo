import React, { useEffect } from "react";

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
}) => {
  const isUsedRow = usedRows.has(rowIndex);
  const isActiveRow = actualEnabled === rowIndex;

  // Função para gerar um identificador único
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
    const index = boxes.find((box) => box === activeBox);

    if (key === "ArrowRight") {
      event.preventDefault();
      moveFocus(index, 1); // Navegar para a direita
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(index, -1); // Navegar para a esquerda
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

    // Garante que o próximo índice esteja dentro dos limites
    if (nextIndex < 0) {
      nextIndex = 0;
    } else if (nextIndex >= boxes.length) {
      nextIndex = boxes.length - 1;
    }

    // Atualiza o índice ativo e o valor de activeBox
    setActiveBox(nextIndex);

    // Verifica se o novo índice de entrada é válido e foca nele
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

      // Se o campo atual não estiver vazio, apague o caractere
      if (newValues[rowIndex][currentIndex] !== "") {
        newValues[rowIndex][currentIndex] = "";
      } else {
        // Caso contrário, mova para a esquerda até encontrar um caractere para apagar
        while (currentIndex > 0 && newValues[rowIndex][currentIndex] === "") {
          currentIndex--;
        }
      }

      // Atualiza o índice ativo e foca o campo
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
            value={values[box]}
            onChange={(event) => handleChange(box, event)}
            onClick={() => setActiveBox(box)}
            onKeyDown={handleKeyDown}
            disabled={actualEnabled !== rowIndex}
            className={`text-4xl uppercase font-black border-black ${
              isActiveRow
                ? "bg-emerald-600"
                : isUsedRow
                ? "bg-teal-950"
                : "bg-emerald-900 opacity-25 brightness-50"
            } text-center w-16 h-16 text-white flex items-center justify-center rounded-lg mb-1 transition-transform duration-300 caret-transparent ease-in-out cursor-pointer ${
              isActiveRow && activeBox === box ? "border-b-8" : ""
            } outline-0 border-2 active:shadow-lg`}
          />
        ))}
      </div>
    </div>
  );
};

export default InputBox;
