import { useRef } from "react";

// Bots that auto-fill every field on page load trip this; real visitors take
// at least a couple seconds to read and type into a form.
const MIN_FILL_TIME_MS = 1500;

export function useSpamGuard() {
  const startedAtRef = useRef(Date.now());

  function isSpam(honeypotValue) {
    if (honeypotValue) return true;
    return Date.now() - startedAtRef.current < MIN_FILL_TIME_MS;
  }

  return { isSpam };
}
