"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getClientState,
  getServerState,
  subscribe,
} from "../_data/studio";

/** Stored content replaces the seed only after hydration, so SSR markup stays stable. */
export default function useStudio() {
  const state = useSyncExternalStore(subscribe, getClientState, getServerState);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return { ...state, ready };
}
