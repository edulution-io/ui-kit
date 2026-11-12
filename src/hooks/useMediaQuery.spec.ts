/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import useMediaQuery from './useMediaQuery';

const TEST_QUERY = '(hover: none)';
const OTHER_QUERY = '(max-width: 767px)';

const stubMatchMedia = (matches: boolean) => {
  const matchMedia = vi.fn((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal('matchMedia', matchMedia);
  return matchMedia;
};

const stubLiveMatchMedia = (matches: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const removeEventListener = vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
    listeners.delete(listener);
  });
  const matchMedia = vi.fn((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    }),
    removeEventListener,
  }));
  vi.stubGlobal('matchMedia', matchMedia);
  return {
    removeEventListener,
    attachedListenerCount: () => listeners.size,
    emitChange: (nextMatches: boolean) => {
      listeners.forEach((listener) => listener({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
};

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports whether the query matches', () => {
    stubMatchMedia(true);

    expect(renderHook(() => useMediaQuery(TEST_QUERY)).result.current).toBe(true);
  });

  it('resolves one media query list per query, so a per-row consumer does not allocate one for every row', () => {
    const matchMedia = stubMatchMedia(true);

    renderHook(() => useMediaQuery(TEST_QUERY));
    renderHook(() => useMediaQuery(TEST_QUERY));
    renderHook(() => useMediaQuery(TEST_QUERY));

    expect(matchMedia).toHaveBeenCalledTimes(1);
    expect(matchMedia).toHaveBeenCalledWith(TEST_QUERY);
  });

  it('keeps distinct queries apart', () => {
    const matchMedia = stubMatchMedia(false);

    renderHook(() => useMediaQuery(TEST_QUERY));
    renderHook(() => useMediaQuery(OTHER_QUERY));

    expect(matchMedia).toHaveBeenCalledTimes(2);
    expect(matchMedia.mock.calls.map(([query]) => query)).toEqual([TEST_QUERY, OTHER_QUERY]);
  });

  it('follows the query after mount, so attaching a mouse or rotating the device re-evaluates it', () => {
    const { emitChange } = stubLiveMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery(TEST_QUERY));
    expect(result.current).toBe(false);

    act(() => emitChange(true));

    expect(result.current).toBe(true);
  });

  it('detaches its listener on unmount, so a removed consumer stops reacting to the shared media query list', () => {
    const { removeEventListener, attachedListenerCount } = stubLiveMatchMedia(false);

    const { unmount } = renderHook(() => useMediaQuery(TEST_QUERY));
    expect(attachedListenerCount()).toBe(1);

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(attachedListenerCount()).toBe(0);
  });

  it('drops a cached media query list when the environment replaces matchMedia', () => {
    stubMatchMedia(true);
    expect(renderHook(() => useMediaQuery(TEST_QUERY)).result.current).toBe(true);

    stubMatchMedia(false);
    expect(renderHook(() => useMediaQuery(TEST_QUERY)).result.current).toBe(false);
  });
});
