import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue
  });

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === key) {
//         setValue(event.newValue ? JSON.parse(event.newValue) : null);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [key]);

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(newValue);
  };

  return [value, setStoredValue];
};
export {useLocalStorage};