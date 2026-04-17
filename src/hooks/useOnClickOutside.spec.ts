/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
 */

import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import useOnClickOutside from './useOnClickOutside';

describe('useOnClickOutside', () => {
  it('calls handler when clicking outside the ref element', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    (ref as { current: HTMLDivElement }).current = div;

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new MouseEvent('mousedown', { bubbles: true });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    document.body.removeChild(div);
  });

  it('does not call handler when clicking inside the ref element', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    (ref as { current: HTMLDivElement }).current = div;

    renderHook(() => useOnClickOutside(ref, handler));

    div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('does not call handler when ref is null', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>();

    renderHook(() => useOnClickOutside(ref, handler));

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    (ref as { current: HTMLDivElement }).current = div;

    const { unmount } = renderHook(() => useOnClickOutside(ref, handler));
    unmount();

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('calls handler on touchstart outside', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    (ref as { current: HTMLDivElement }).current = div;

    renderHook(() => useOnClickOutside(ref, handler));

    const event = new TouchEvent('touchstart', { bubbles: true });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);

    document.body.removeChild(div);
  });

  it('does not call handler on touchstart inside', () => {
    const handler = vi.fn();
    const ref = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    (ref as { current: HTMLDivElement }).current = div;

    renderHook(() => useOnClickOutside(ref, handler));

    div.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('supports an array of refs and calls handler when clicking outside all', () => {
    const handler = vi.fn();
    const ref1 = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const ref2 = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    (ref1 as { current: HTMLDivElement }).current = div1;
    (ref2 as { current: HTMLDivElement }).current = div2;

    renderHook(() => useOnClickOutside([ref1, ref2], handler));

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });

  it('does not call handler when clicking inside any ref of the array', () => {
    const handler = vi.fn();
    const ref1 = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const ref2 = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    (ref1 as { current: HTMLDivElement }).current = div1;
    (ref2 as { current: HTMLDivElement }).current = div2;

    renderHook(() => useOnClickOutside([ref1, ref2], handler));

    div1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    div2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });
});
