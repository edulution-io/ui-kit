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
import useElementWidth from './useElementWidth';

describe('useElementWidth', () => {
  it('returns 0 initially when ref has no element', () => {
    const ref = createRef<HTMLElement>();
    const { result } = renderHook(() => useElementWidth(ref));
    expect(result.current).toBe(0);
  });

  it('returns width from getBoundingClientRect when element is present', () => {
    const ref = createRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;
    const div = document.createElement('div');
    document.body.appendChild(div);
    vi.spyOn(div, 'getBoundingClientRect').mockReturnValue({
      width: 320,
      height: 0,
      top: 0,
      left: 0,
      right: 320,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    (ref as { current: HTMLElement }).current = div;

    const { result } = renderHook(() => useElementWidth(ref));
    expect(result.current).toBe(320);

    document.body.removeChild(div);
  });
});
