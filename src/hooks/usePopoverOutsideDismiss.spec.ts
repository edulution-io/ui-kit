/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
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
