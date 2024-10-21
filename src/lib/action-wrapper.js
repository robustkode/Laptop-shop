"use client";
import { useReducer } from "react";

const initialState = {
  isPending: false,
  error: null,
  data: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, isPending: true, error: null };
    case "SUCCESS":
      return { ...state, isPending: false, data: action.payload };
    case "ERROR":
      return { ...state, isPending: false, error: action.payload };
    // case 'RESET':
    //   return initialState;
    default:
      return state;
  }
}

export default function useActionWrapper(action) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const execute = async (...args) => {
    dispatch({ type: "START" });

    try {
      const result = await action(...args);
      console.log(result, "wrapper");
      if (result?.error) {
        dispatch({ type: "ERROR", payload: result.error });
      } else {
        dispatch({ type: "SUCCESS", payload: result?.success?.data });
      }
      return result;
    } catch (err) {
      console.log(err, "what");
      dispatch({
        type: "ERROR",
        payload: {
          message: "Unknown error",
          code: err.code || "UNKNOWN_ERROR",
        },
      });
      return { error: { code: "UNKNOWN_ERROR", message: "Unknown error" } };
    }
  };

  return { ...state, execute };
}
