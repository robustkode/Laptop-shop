import React, { useEffect, useState } from "react";

export default function useDebounceVal(value, delay = 300) {
  const [dval, setDval] = useState(value);

  useEffect(() => {
    const _ = setTimeout(() => {
      setDval(value);
    }, delay);

    return () => {
      clearTimeout(_);
    };
  }, [value, delay]);
  return dval;
}
