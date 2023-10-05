"use client";

import { useState, useRef, useEffect } from "react";

function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const isClient = typeof window !== "undefined";

  const [state, setState] = useState(() => {
    if (isClient) {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      }
    }
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      if (isClient) {
        window.localStorage.removeItem(prevKey);
      }
    }
    prevKeyRef.current = key;

    if (isClient) {
      window.localStorage.setItem(key, serialize(state));
    }
  }, [key, state, serialize]);

  return [state, setState];
}

export { useLocalStorageState };
