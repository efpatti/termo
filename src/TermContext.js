import React, { createContext, useContext, useState, useEffect } from "react";

const TermContext = createContext();

export const TermProvider = ({ children }) => {
  const [termNumber, setTermNumber] = useState(null);
  const [termActual, setTermActual] = useState("Termo");
  const [colorActual, setColorActual] = useState("emerald");

  useEffect(() => {
    switch (termActual) {
      case "Termo":
        setTermNumber(1);
        setColorActual("emerald");
        break;
      case "Dueto":
        setTermNumber(2);
        setColorActual("pink");
        break;
      case "Quarteto":
        setTermNumber(4);
        setColorActual("purple");
        break;
      default:
        setTermNumber(null);
        break;
    }
  }, [termActual]);

  return (
    <TermContext.Provider
      value={{
        termNumber,
        setTermNumber,
        termActual,
        setTermActual,
        colorActual,
      }}
    >
      {children}
    </TermContext.Provider>
  );
};

export const useTermContext = () => useContext(TermContext);
