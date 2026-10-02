/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import useCenterScroll from './useCenterScroll';

describe('useCenterScroll', () => {
  const makeRef = () => {
    const div = document.createElement('div');
    return { div, ref: { current: div } as React.MutableRefObject<HTMLElement> };
  };

  it('does nothing when ref has no element', () => {
    const ref = createRef<HTMLElement>();
    expect(() => renderHook(() => useCenterScroll(ref, 500, 200, 1000))).not.toThrow();
  });

  it('does nothing when containerWidth is 0', () => {
    const { div, ref } = makeRef();
    div.scrollLeft = 42;
    renderHook(() => useCenterScroll(ref, 500, 0, 1000));
    expect(div.scrollLeft).toBe(42);
  });

  it('centers target within bounds', () => {
    const { div, ref } = makeRef();
    renderHook(() => useCenterScroll(ref, 500, 200, 1000));
    expect(div.scrollLeft).toBe(400);
  });

  it('clamps to 0 when target would scroll negative', () => {
    const { div, ref } = makeRef();
    renderHook(() => useCenterScroll(ref, 50, 200, 1000));
    expect(div.scrollLeft).toBe(0);
  });

  it('clamps to (trackWidth - containerWidth) when target would overflow', () => {
    const { div, ref } = makeRef();
    renderHook(() => useCenterScroll(ref, 950, 200, 1000));
    expect(div.scrollLeft).toBe(800);
  });

  it('re-centers when containerWidth changes (resize)', () => {
    const { div, ref } = makeRef();
    const { rerender } = renderHook(({ w }: { w: number }) => useCenterScroll(ref, 500, w, 1000), {
      initialProps: { w: 200 },
    });
    expect(div.scrollLeft).toBe(400);
    rerender({ w: 400 });
    expect(div.scrollLeft).toBe(300);
  });

  it('re-centers when targetPx changes', () => {
    const { div, ref } = makeRef();
    const { rerender } = renderHook(({ t }: { t: number }) => useCenterScroll(ref, t, 200, 1000), {
      initialProps: { t: 500 },
    });
    expect(div.scrollLeft).toBe(400);
    rerender({ t: 600 });
    expect(div.scrollLeft).toBe(500);
  });
});
