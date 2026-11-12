/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { act, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import useHorizontalScrollFade from './useHorizontalScrollFade';

const setLayout = (element: HTMLElement, layout: { scrollWidth: number; clientWidth: number; scrollLeft: number }) => {
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: layout.scrollWidth });
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: layout.clientWidth });
  Object.defineProperty(element, 'scrollLeft', { configurable: true, writable: true, value: layout.scrollLeft });
};

const Probe = ({ children }: { children?: ReactNode }) => {
  const { ref, isOverflowing, fadeStyle } = useHorizontalScrollFade<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-testid="row"
      data-overflowing={String(isOverflowing)}
      style={fadeStyle}
    >
      row
      {children}
    </div>
  );
};

const resizeCallbacks: ResizeObserverCallback[] = [];
const disconnectResizeObserver = vi.fn();
const observeResizeObserver = vi.fn();

describe('useHorizontalScrollFade', () => {
  beforeEach(() => {
    resizeCallbacks.length = 0;
    disconnectResizeObserver.mockClear();
    observeResizeObserver.mockClear();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallbacks.push(callback);
        }

        observe = observeResizeObserver;

        disconnect = disconnectResizeObserver;

        unobserve = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const triggerResize = () =>
    act(() => {
      resizeCallbacks.forEach((callback) => callback([], {} as ResizeObserver));
    });

  it('reports no overflow and applies no mask when the content fits', () => {
    render(<Probe />);
    const row = screen.getByTestId('row');
    setLayout(row, { scrollWidth: 400, clientWidth: 400, scrollLeft: 0 });
    triggerResize();

    expect(row).toHaveAttribute('data-overflowing', 'false');
    expect(row.style.maskImage).toBe('');
  });

  it('fades only the end edge when the content is clipped on the right', () => {
    render(<Probe />);
    const row = screen.getByTestId('row');
    setLayout(row, { scrollWidth: 900, clientWidth: 400, scrollLeft: 0 });
    triggerResize();

    expect(row).toHaveAttribute('data-overflowing', 'true');
    expect(row.style.maskImage).toContain('black 0');
    expect(row.style.maskImage).toContain('calc(100% - 1.5rem)');
  });

  it('fades both edges while scrolled into the middle and only the start edge at the end', () => {
    render(<Probe />);
    const row = screen.getByTestId('row');
    setLayout(row, { scrollWidth: 900, clientWidth: 400, scrollLeft: 200 });
    act(() => {
      row.dispatchEvent(new Event('scroll'));
    });
    expect(row.style.maskImage).toContain('transparent 0');
    expect(row.style.maskImage).toContain('calc(100% - 1.5rem)');

    setLayout(row, { scrollWidth: 900, clientWidth: 400, scrollLeft: 500 });
    act(() => {
      row.dispatchEvent(new Event('scroll'));
    });
    expect(row.style.maskImage).toContain('transparent 0');
    expect(row.style.maskImage).not.toContain('calc(100% - 1.5rem)');
  });

  it('re-measures when a child is added without the list itself resizing', async () => {
    render(<Probe />);
    const row = screen.getByTestId('row');
    setLayout(row, { scrollWidth: 900, clientWidth: 400, scrollLeft: 0 });

    await act(async () => {
      row.appendChild(document.createElement('span'));
      await Promise.resolve();
    });

    expect(row).toHaveAttribute('data-overflowing', 'true');
  });

  it('watches every child, so a trigger that widens inside an already clamped row is noticed', () => {
    render(
      <Probe>
        <span data-testid="child">a</span>
      </Probe>,
    );

    expect(observeResizeObserver).toHaveBeenCalledWith(screen.getByTestId('row'));
    expect(observeResizeObserver).toHaveBeenCalledWith(screen.getByTestId('child'));
  });

  it('stops listening on unmount', () => {
    const { unmount } = render(<Probe />);
    const row = screen.getByTestId('row');
    const removeListener = vi.spyOn(row, 'removeEventListener');

    unmount();

    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(disconnectResizeObserver).toHaveBeenCalled();
  });
});
