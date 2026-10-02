/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import useKeyboardInset from './useKeyboardInset';

interface MockVisualViewport {
  height: number;
  offsetTop: number;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

const setInnerHeight = (value: number) => {
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value,
  });
};

const setVisualViewport = (viewport: MockVisualViewport | undefined) => {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    writable: true,
    value: viewport,
  });
};

describe('useKeyboardInset', () => {
  const originalInnerHeight = window.innerHeight;
  const originalViewport = window.visualViewport;

  afterEach(() => {
    setInnerHeight(originalInnerHeight);
    setVisualViewport(originalViewport as unknown as MockVisualViewport | undefined);
    vi.restoreAllMocks();
  });

  it('returns 0 when visualViewport is unavailable', () => {
    setInnerHeight(800);
    setVisualViewport(undefined);

    const { result } = renderHook(() => useKeyboardInset());

    expect(result.current).toBe(0);
  });

  it('computes the inset from innerHeight minus viewport height and offsetTop', () => {
    setInnerHeight(800);
    const viewport: MockVisualViewport = {
      height: 500,
      offsetTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    setVisualViewport(viewport);

    const { result } = renderHook(() => useKeyboardInset());

    expect(result.current).toBe(300);
  });

  it('clamps negative insets to 0', () => {
    setInnerHeight(500);
    const viewport: MockVisualViewport = {
      height: 800,
      offsetTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    setVisualViewport(viewport);

    const { result } = renderHook(() => useKeyboardInset());

    expect(result.current).toBe(0);
  });

  it('registers resize and scroll listeners on the visualViewport', () => {
    setInnerHeight(800);
    const viewport: MockVisualViewport = {
      height: 800,
      offsetTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    setVisualViewport(viewport);

    renderHook(() => useKeyboardInset());

    expect(viewport.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(viewport.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('removes the listeners on unmount', () => {
    setInnerHeight(800);
    const viewport: MockVisualViewport = {
      height: 800,
      offsetTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    setVisualViewport(viewport);

    const { unmount } = renderHook(() => useKeyboardInset());

    unmount();

    expect(viewport.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(viewport.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('updates the inset when the resize listener fires', () => {
    setInnerHeight(800);
    let resizeHandler: (() => void) | undefined;
    const viewport: MockVisualViewport = {
      height: 800,
      offsetTop: 0,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'resize') resizeHandler = handler as () => void;
      }),
      removeEventListener: vi.fn(),
    };
    setVisualViewport(viewport);

    const { result } = renderHook(() => useKeyboardInset());

    expect(result.current).toBe(0);

    act(() => {
      viewport.height = 500;
      resizeHandler?.();
    });

    expect(result.current).toBe(300);
  });
});
