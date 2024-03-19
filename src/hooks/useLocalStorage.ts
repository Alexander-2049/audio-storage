import { useState, useEffect } from "react";

const useLocalStorage = (
  key: string,
  defaultValue: string | number
): [string | number, React.Dispatch<React.SetStateAction<string | number>>] => {
  const [value, setValue] = useState<string | number>(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
