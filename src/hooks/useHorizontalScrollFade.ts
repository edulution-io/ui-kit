/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';

const SCROLL_EDGE_THRESHOLD_PX = 1;
const FADE_SIZE_REM = 1.5;
const FADE_OPAQUE_COLOR = 'black';
const FADE_TRANSPARENT_COLOR = 'transparent';

interface HorizontalScrollState {
  canScrollStart: boolean;
  canScrollEnd: boolean;
}

const buildHorizontalFadeMask = (fadeStart: boolean, fadeEnd: boolean): string => {
  const size = `${FADE_SIZE_REM}rem`;
  const start = fadeStart ? `${FADE_TRANSPARENT_COLOR} 0, ${FADE_OPAQUE_COLOR} ${size}` : `${FADE_OPAQUE_COLOR} 0`;
  const end = fadeEnd
    ? `${FADE_OPAQUE_COLOR} calc(100% - ${size}), ${FADE_TRANSPARENT_COLOR} 100%`
    : `${FADE_OPAQUE_COLOR} 100%`;
  return `linear-gradient(to right, ${start}, ${end})`;
};

const useHorizontalScrollFade = <T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T | null>;
  isOverflowing: boolean;
  fadeStyle: CSSProperties | undefined;
} => {
  const ref = useRef<T>(null);
  const [state, setState] = useState<HorizontalScrollState>({ canScrollStart: false, canScrollEnd: false });

  const update = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    const { scrollLeft, scrollWidth, clientWidth } = element;
    const canScrollStart = scrollLeft > SCROLL_EDGE_THRESHOLD_PX;
    const canScrollEnd = scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_THRESHOLD_PX;
    setState((prev) =>
      prev.canScrollStart === canScrollStart && prev.canScrollEnd === canScrollEnd
        ? prev
        : { canScrollStart, canScrollEnd },
    );
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    update();
    element.addEventListener('scroll', update, { passive: true });

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    const observeSizes = () => {
      resizeObserver?.observe(element);
      Array.from(element.children).forEach((child) => resizeObserver?.observe(child));
    };
    observeSizes();

    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            observeSizes();
            update();
          })
        : null;
    mutationObserver?.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      element.removeEventListener('scroll', update);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [update]);

  const { canScrollStart, canScrollEnd } = state;
  const isOverflowing = canScrollStart || canScrollEnd;

  const fadeStyle = useMemo<CSSProperties | undefined>(() => {
    if (!isOverflowing) return undefined;
    const maskImage = buildHorizontalFadeMask(canScrollStart, canScrollEnd);
    return { maskImage, WebkitMaskImage: maskImage };
  }, [isOverflowing, canScrollStart, canScrollEnd]);

  return { ref, isOverflowing, fadeStyle };
};

export default useHorizontalScrollFade;
