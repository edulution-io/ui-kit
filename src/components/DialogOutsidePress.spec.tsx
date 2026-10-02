/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { act, render } from '@testing-library/react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './Dialog';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from './Sheet';

interface LayerProps {
  onOpenChange: (isOpen: boolean) => void;
  onPointerDownOutside?: (event: Event) => void;
}

const DialogLayer = ({ onOpenChange, onPointerDownOutside }: LayerProps) => (
  <Dialog
    open
    onOpenChange={onOpenChange}
  >
    <DialogContent
      showCloseButton={false}
      onPointerDownOutside={onPointerDownOutside}
    >
      <DialogTitle>dialog</DialogTitle>
      <DialogDescription>dialog</DialogDescription>
    </DialogContent>
  </Dialog>
);

const SheetLayer = ({ onOpenChange, onPointerDownOutside }: LayerProps) => (
  <Sheet
    open
    onOpenChange={onOpenChange}
  >
    <SheetContent
      side="bottom"
      showCloseButton={false}
      onPointerDownOutside={onPointerDownOutside}
    >
      <SheetTitle>sheet</SheetTitle>
      <SheetDescription>sheet</SheetDescription>
    </SheetContent>
  </Sheet>
);

const PRESS_SEQUENCE = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];

const pressOutside = ({
  isRemovedByItsClick,
  container = document.body,
}: {
  isRemovedByItsClick: boolean;
  container?: HTMLElement;
}) => {
  const outside = document.createElement('button');
  container.appendChild(outside);
  if (isRemovedByItsClick) outside.addEventListener('click', () => outside.remove());
  PRESS_SEQUENCE.forEach((type) => {
    outside.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0 }));
  });
  outside.remove();
};

const dialogAboveClosedByItsOwnClick = () => {
  const dialogAbove = document.createElement('div');
  dialogAbove.setAttribute('role', 'dialog');
  dialogAbove.setAttribute('data-state', 'open');
  dialogAbove.addEventListener('click', () => dialogAbove.setAttribute('data-state', 'closed'));
  const footer = document.createElement('div');
  dialogAbove.appendChild(footer);
  document.body.appendChild(dialogAbove);
  return { dialogAbove, footer };
};

const letOutsidePressListenersAttach = () =>
  act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  });

describe.each([
  ['Dialog', DialogLayer],
  ['Sheet', SheetLayer],
])('%s outside press', (_kind, Layer) => {
  it('closes when the press lands beside it', async () => {
    const onOpenChange = vi.fn();
    render(<Layer onOpenChange={onOpenChange} />);
    await letOutsidePressListenersAttach();

    pressOutside({ isRemovedByItsClick: false });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('stays open when the pressed element is gone by the time the press completes, as when it closed a dialog above', async () => {
    const onOpenChange = vi.fn();
    render(<Layer onOpenChange={onOpenChange} />);
    await letOutsidePressListenersAttach();

    pressOutside({ isRemovedByItsClick: true });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('stays open when the pressed element belongs to a dialog above that its click starts to close, as while that sheet slides out', async () => {
    const onOpenChange = vi.fn();
    render(<Layer onOpenChange={onOpenChange} />);
    await letOutsidePressListenersAttach();
    const { dialogAbove, footer } = dialogAboveClosedByItsOwnClick();

    pressOutside({ isRemovedByItsClick: false, container: footer });

    expect(dialogAbove).toHaveAttribute('data-state', 'closed');
    expect(onOpenChange).not.toHaveBeenCalled();
    dialogAbove.remove();
  });

  it('stays open for a press whose element is gone even when the caller passes a handler that lets presses dismiss', async () => {
    const onOpenChange = vi.fn();
    const onPointerDownOutside = vi.fn();
    render(
      <Layer
        onOpenChange={onOpenChange}
        onPointerDownOutside={onPointerDownOutside}
      />,
    );
    await letOutsidePressListenersAttach();

    pressOutside({ isRemovedByItsClick: true });

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('stays open for a press on a closing dialog above even when the caller passes a handler that lets presses dismiss', async () => {
    const onOpenChange = vi.fn();
    const onPointerDownOutside = vi.fn();
    render(
      <Layer
        onOpenChange={onOpenChange}
        onPointerDownOutside={onPointerDownOutside}
      />,
    );
    await letOutsidePressListenersAttach();
    const { dialogAbove, footer } = dialogAboveClosedByItsOwnClick();

    pressOutside({ isRemovedByItsClick: false, container: footer });

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    dialogAbove.remove();
  });

  it('still runs the outside-press handler the caller passes, which may keep it open', async () => {
    const onOpenChange = vi.fn();
    const onPointerDownOutside = vi.fn((event: Event) => event.preventDefault());
    render(
      <Layer
        onOpenChange={onOpenChange}
        onPointerDownOutside={onPointerDownOutside}
      />,
    );
    await letOutsidePressListenersAttach();

    pressOutside({ isRemovedByItsClick: false });

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
