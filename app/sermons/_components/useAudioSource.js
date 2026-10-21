"use client";
import { useEffect, useState } from "react";
import { getAudioBlob, isLocalAudio } from "../_data/studioAudio";

/**
 * Turns a studio `local:<id>` reference into a temporary object URL.
 * Hosted URLs pass straight through so nothing changes for real recordings.
 */
export default function useAudioSource(url) {
  const [resolved, setResolved] = useState(() =>
    url && !isLocalAudio(url) ? url : "",
  );
  const [local, setLocal] = useState(() => Boolean(url && isLocalAudio(url)));
  const [loading, setLoading] = useState(() => Boolean(url && isLocalAudio(url)));

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    if (!url) {
      setResolved("");
      setLocal(false);
      setLoading(false);
      return () => {};
    }
    if (!isLocalAudio(url)) {
      setResolved(url);
      setLocal(false);
      setLoading(false);
      return () => {};
    }
    setLocal(true);
    setLoading(true);
    setResolved("");
    getAudioBlob(url)
      .then((blob) => {
        if (cancelled) return;
        if (!blob) {
          setLoading(false);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setResolved(objectUrl);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { source: resolved, isLocal: local, loading };
}
