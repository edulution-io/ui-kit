/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import type { PointerEvent as ReactPointerEvent } from 'react';
import synthesizePenClick from './synthesizePenClick';

const makeButton = (connected: boolean, disabled = false) => {
  const button = document.createElement('button');
  button.disabled = disabled;
  if (connected) document.body.appendChild(button);
  return button;
};

const makeEvent = (pointerType: string, currentTarget: HTMLElement, defaultPrevented = false) =>
  ({
    pointerType,
    defaultPrevented,
    preventDefault: vi.fn(),
    currentTarget,
  }) as unknown as ReactPointerEvent<HTMLElement>;

describe('synthesizePenClick', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('prevents the default and synthesizes a click for pen input', () => {
    const button = makeButton(true);
    const clickSpy = vi.spyOn(button, 'click');
    const event = makeEvent('pen', button);

    synthesizePenClick(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it.each(['mouse', 'touch'])('does nothing for %s input', (pointerType) => {
    const button = makeButton(true);
    const clickSpy = vi.spyOn(button, 'click');
    const event = makeEvent(pointerType, button);

    synthesizePenClick(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does nothing when the default is already prevented', () => {
    const button = makeButton(true);
    const clickSpy = vi.spyOn(button, 'click');
    const event = makeEvent('pen', button, true);

    synthesizePenClick(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does not click a disabled target', () => {
    const button = makeButton(true, true);
    const clickSpy = vi.spyOn(button, 'click');

    synthesizePenClick(makeEvent('pen', button));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does not click a target detached from the DOM', () => {
    const button = makeButton(false);
    const clickSpy = vi.spyOn(button, 'click');

    synthesizePenClick(makeEvent('pen', button));

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('suppresses the echo click that follows so a toggle fires only once', () => {
    const parent = document.createElement('div');
    const button = document.createElement('button');
    parent.appendChild(button);
    document.body.appendChild(parent);
    const handleClick = vi.fn();
    parent.addEventListener('click', handleClick);

    synthesizePenClick(makeEvent('pen', button));

    const echoClick = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(echoClick);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(echoClick.defaultPrevented).toBe(true);
  });

  it('fires a second pen tap even when the first native echo never arrives', () => {
    const parent = document.createElement('div');
    const button = document.createElement('button');
    parent.appendChild(button);
    document.body.appendChild(parent);
    const handleClick = vi.fn();
    parent.addEventListener('click', handleClick);

    synthesizePenClick(makeEvent('pen', button));
    synthesizePenClick(makeEvent('pen', button));

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('fires both activations when two pen taps land in the same frame before the first synthesized click', () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.mocked(window.requestAnimationFrame).mockImplementation((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    const parent = document.createElement('div');
    const button = document.createElement('button');
    parent.appendChild(button);
    document.body.appendChild(parent);
    const handleClick = vi.fn();
    parent.addEventListener('click', handleClick);

    synthesizePenClick(makeEvent('pen', button));
    synthesizePenClick(makeEvent('pen', button));

    expect(handleClick).not.toHaveBeenCalled();

    rafCallbacks.forEach((cb) => cb(0));

    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
