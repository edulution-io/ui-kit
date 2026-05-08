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
