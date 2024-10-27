"use client";
import { useEffect, useReducer, useState } from "react";

function reducer(state, action) {
  const { catagory, value } = action;
  return {
    ...state,
    [catagory]: value,
  };
}

function useActionWrapper(serverAction) {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // const [_, dispatch] = useReducer(reducer, {
  //   isPending: false,
  //   data: null,
  //   error: null,
  // });

  const execute = async (...args) => {
    // dispatch({
    //   payload: { category: "isPending", value: false },
    // });
    // dispatch({
    //   payload: { category: "error", value: null },
    // });

    // setIsPending(true);
    // setError(null);

    try {
      //receive successful responsein  format { success: { data } }
      const result = await serverAction(...args);
      if (result?.error) {
        setError(result.error);
      } else {
        setData(result?.success?.data);
      }
    } catch (err) {
      // unexpected errors
      setError({ message: "Unknown error", code: err.code || "UNKNOWN_ERROR" });
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, data, error, execute };
}

export default useActionWrapper;
