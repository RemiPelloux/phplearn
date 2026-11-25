"use client";

import { useSyncExternalStore } from "react";

const detectMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

/** True on macOS and iOS (after hydration; false on the server). */
export function useIsMac() {
  return useSyncExternalStore(
    () => () => {},
    detectMac,
    () => false,
  );
}

/** "Mod-Shift-Enter" → ["⌘", "⇧", "↩"] on Mac, ["Ctrl", "Shift", "Enter"] elsewhere. */
export function keyParts(combo: string, mac: boolean): string[] {
  return combo.split("-").map((k) => {
    if (k === "Mod") return mac ? "⌘" : "Ctrl";
    if (k === "Ctrl") return mac ? "⌃" : "Ctrl";
    if (k === "Alt") return mac ? "⌥" : "Alt";
    if (k === "Shift") return mac ? "⇧" : "Shift";
    if (k === "Enter") return mac ? "↩" : "Enter";
    if (k === "Up") return "↑";
    if (k === "Down") return "↓";
    if (k === "Space") return mac ? "Space" : "Space";
    return k.length === 1 ? k.toUpperCase() : k;
  });
}
