/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import useEscapeCapture from './useEscapeCapture';

const pressEscape = () => {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  document.dispatchEvent(event);
  return event;
};
const pressEnter = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

describe('useEscapeCapture', () => {
  let documentListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    documentListener = vi.fn();
    document.addEventListener('keydown', documentListener, { capture: true });
  });

  afterEach(() => {
    document.removeEventListener('keydown', documentListener, { capture: true });
  });

  it('calls the handler and keeps Escape from reaching a document capture listener while active', () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeCapture(true, onEscape));

    const event = pressEscape();

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(documentListener).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it("leaves the key's default action alone while inactive", () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeCapture(false, onEscape));

    const event = pressEscape();

    expect(event.defaultPrevented).toBe(false);
  });

  it('lets Escape through untouched while inactive', () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeCapture(false, onEscape));

    pressEscape();

    expect(onEscape).not.toHaveBeenCalled();
    expect(documentListener).toHaveBeenCalledTimes(1);
  });

  it('keeps Escape from reaching another window capture listener, not just the layers below it', () => {
    const onEscape = vi.fn();
    const otherWindowListener = vi.fn();
    renderHook(() => useEscapeCapture(true, onEscape));
    window.addEventListener('keydown', otherWindowListener, { capture: true });

    try {
      pressEscape();
    } finally {
      window.removeEventListener('keydown', otherWindowListener, { capture: true });
    }

    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(otherWindowListener).not.toHaveBeenCalled();
  });

  it('ignores every other key', () => {
    const onEscape = vi.fn();
    renderHook(() => useEscapeCapture(true, onEscape));

    pressEnter();

    expect(onEscape).not.toHaveBeenCalled();
    expect(documentListener).toHaveBeenCalledTimes(1);
  });

  it('stops capturing once it goes inactive', () => {
    const onEscape = vi.fn();
    const { rerender } = renderHook(({ isActive }) => useEscapeCapture(isActive, onEscape), {
      initialProps: { isActive: true },
    });

    rerender({ isActive: false });
    pressEscape();

    expect(onEscape).not.toHaveBeenCalled();
    expect(documentListener).toHaveBeenCalledTimes(1);
  });

  it('stops capturing on unmount', () => {
    const onEscape = vi.fn();
    const { unmount } = renderHook(() => useEscapeCapture(true, onEscape));

    unmount();
    pressEscape();

    expect(onEscape).not.toHaveBeenCalled();
    expect(documentListener).toHaveBeenCalledTimes(1);
  });

  it('calls the latest handler without re-registering the listener on every render', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();
    const { rerender } = renderHook(({ onEscape }) => useEscapeCapture(true, onEscape), {
      initialProps: { onEscape: firstHandler },
    });
    const registrationsAfterMount = addEventListenerSpy.mock.calls.filter(([type]) => type === 'keydown').length;

    rerender({ onEscape: secondHandler });
    pressEscape();

    expect(secondHandler).toHaveBeenCalledTimes(1);
    expect(firstHandler).not.toHaveBeenCalled();
    expect(addEventListenerSpy.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(registrationsAfterMount);
    addEventListenerSpy.mockRestore();
  });
});
