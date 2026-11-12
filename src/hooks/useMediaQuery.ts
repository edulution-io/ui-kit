/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useEffect, useState } from 'react';

const mediaQueryCache = new Map<string, { source: typeof globalThis.matchMedia; mediaQuery: MediaQueryList }>();

const getMatchMedia = (query: string): MediaQueryList | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;

  const cached = mediaQueryCache.get(query);
  if (cached && cached.source === globalThis.matchMedia) return cached.mediaQuery;

  const mediaQuery = window.matchMedia(query);
  mediaQueryCache.set(query, { source: globalThis.matchMedia, mediaQuery });
  return mediaQuery;
};

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => getMatchMedia(query)?.matches ?? false);

  useEffect(() => {
    const mediaQuery = getMatchMedia(query);
    if (!mediaQuery) return undefined;

    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
