/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import ignorePressFromClosingLayer from './ignorePressFromClosingLayer';

const outsidePressOn = (target: EventTarget | null) =>
  new CustomEvent('dismissableLayer.pointerDownOutside', {
    cancelable: true,
    detail: { originalEvent: { target } as unknown as PointerEvent },
  });

describe('ignorePressFromClosingLayer', () => {
  it('lets a press on an element still in the page dismiss', () => {
    const element = document.createElement('button');
    document.body.appendChild(element);
    const event = outsidePressOn(element);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(false);
    element.remove();
  });

  it('keeps the layer open for a press whose element has left the page since', () => {
    const element = document.createElement('button');
    const event = outsidePressOn(element);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('keeps the layer open for a press on a dialog that is closing, as while a sheet slides out', () => {
    const closingDialog = document.createElement('div');
    closingDialog.setAttribute('role', 'dialog');
    closingDialog.setAttribute('data-state', 'closed');
    const footer = document.createElement('div');
    const element = document.createElement('button');
    footer.appendChild(element);
    closingDialog.appendChild(footer);
    document.body.appendChild(closingDialog);
    const event = outsidePressOn(element);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(true);
    closingDialog.remove();
  });

  it('lets a press on an open dialog dismiss', () => {
    const openDialog = document.createElement('div');
    openDialog.setAttribute('role', 'dialog');
    openDialog.setAttribute('data-state', 'open');
    const element = document.createElement('button');
    openDialog.appendChild(element);
    document.body.appendChild(openDialog);
    const event = outsidePressOn(element);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(false);
    openDialog.remove();
  });

  it('lets a press on a closed element that is no dialog dismiss, such as a collapsed accordion', () => {
    const collapsed = document.createElement('div');
    collapsed.setAttribute('data-state', 'closed');
    const element = document.createElement('button');
    collapsed.appendChild(element);
    document.body.appendChild(collapsed);
    const event = outsidePressOn(element);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(false);
    collapsed.remove();
  });

  it('lets a press without an element target dismiss', () => {
    const event = outsidePressOn(null);

    ignorePressFromClosingLayer(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
