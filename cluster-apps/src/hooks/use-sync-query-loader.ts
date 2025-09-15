import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import useLoading from "./use-loading";
import { useEffect } from "react";

export function useSyncQueryLoading() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const { startLoading, stopLoading } = useLoading();
  
    useEffect(() => {
      let showTimer: NodeJS.Timeout | undefined;
      let hideTimer: NodeJS.Timeout | undefined;
    
      if (isFetching + isMutating > 0) {
        // lagi ada request → tunggu 3 detik buat munculin
        showTimer = setTimeout(() => {
          startLoading("Loading...");
        }, 3000);
    
        // kalau ada hideTimer sebelumnya, cancel
        clearTimeout(hideTimer);
      } else {
        // kalau udah selesai → kasih delay dikit biar smooth
        hideTimer = setTimeout(() => {
          stopLoading();
        }, 300);
        // cancel showTimer kalau belum sempet tampil
        clearTimeout(showTimer);
      }
    
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }, [isFetching, isMutating, startLoading, stopLoading]);
  }