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
import usePopoverOutsideDismiss from './usePopoverOutsideDismiss';

const POPPER_CONTENT_ATTRIBUTE = 'data-radix-popper-content-wrapper';

const pointerDown = () => new MouseEvent('pointerdown', { bubbles: true });

const appendTo = (parent: HTMLElement, tag: string, attribute?: string) => {
  const element = document.createElement(tag);
  if (attribute) element.setAttribute(attribute, '');
  parent.appendChild(element);
  return element;
};

describe('usePopoverOutsideDismiss', () => {
  let anchor: HTMLElement;
  let anchorRef: { current: HTMLElement | null };
  let onDismiss: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onDismiss = vi.fn();
    anchor = appendTo(document.body, 'button');
    anchorRef = { current: anchor };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('dismisses on a pointer down outside the anchor and outside every popper', () => {
    const outside = appendTo(document.body, 'button');
    renderHook(() => usePopoverOutsideDismiss(anchorRef, onDismiss));

    outside.dispatchEvent(pointerDown());

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on a pointer down inside popper content', () => {
    const popper = appendTo(document.body, 'div', POPPER_CONTENT_ATTRIBUTE);
    const insidePopper = appendTo(popper, 'button');
    renderHook(() => usePopoverOutsideDismiss(anchorRef, onDismiss));

    insidePopper.dispatchEvent(pointerDown());

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss on a pointer down inside the anchor', () => {
    const insideAnchor = appendTo(anchor, 'span');
    renderHook(() => usePopoverOutsideDismiss(anchorRef, onDismiss));

    insideAnchor.dispatchEvent(pointerDown());

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses when the pointer down target is not an element', () => {
    renderHook(() => usePopoverOutsideDismiss(anchorRef, onDismiss));

    document.dispatchEvent(pointerDown());

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
