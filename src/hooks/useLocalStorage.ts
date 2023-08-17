import { useRef, useEffect } from "react";

export function useLocalStorageSet(
  item: string,
  data: string | number | object | boolean
) {
  useEffect(() => {
    return localStorage.setItem(item, JSON.stringify(data));
  });
  return data;
}

export function useLocalStorageGet(item: string) {
  const data = useRef<string>("");
  useEffect(() => {
    const stringified = localStorage.getItem(item);
    data.current = stringified && JSON.parse(stringified);
  });
  return data.current;
}
