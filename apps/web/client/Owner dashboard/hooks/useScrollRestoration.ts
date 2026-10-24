"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook to automatically persist and restore scroll position on an element (or window)
 * across navigations in Next.js.
 * Saves to sessionStorage keyed by pathname (and optional custom key).
 */
export function useScrollRestoration<T extends HTMLElement = HTMLElement>(customKey?: string) {
  const pathname = usePathname();
  const elementRef = useRef<T | null>(null);
  const storageKey = `vt_scroll_${customKey || pathname || "default"}`;

  // Save scroll position helper
  const saveScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollPos = elementRef.current ? elementRef.current.scrollTop : window.scrollY;
    try {
      sessionStorage.setItem(storageKey, String(Math.round(scrollPos)));
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  // Restore scroll position on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let savedPos: number | null = null;
    try {
      const val = sessionStorage.getItem(storageKey);
      if (val !== null) {
        savedPos = parseInt(val, 10);
      }
    } catch {
      savedPos = null;
    }

    if (savedPos !== null && !isNaN(savedPos) && savedPos > 0) {
      const targetPos = savedPos;
      const restore = () => {
        if (elementRef.current) {
          elementRef.current.scrollTop = targetPos;
        } else {
          window.scrollTo({ top: targetPos, behavior: "instant" as ScrollBehavior });
        }
      };

      // Multi-tick restore to ensure layout, images, and fonts have calculated height
      requestAnimationFrame(restore);
      const timer1 = setTimeout(restore, 40);
      const timer2 = setTimeout(restore, 120);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [storageKey, pathname]);

  // Listen for scroll events on the element
  useEffect(() => {
    const el = elementRef.current;
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveScroll();
      }, 80);
    };

    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    const handleBeforeUnload = () => {
      saveScroll();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (el) {
        saveScroll();
        el.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveScroll]);

  return elementRef;
}
