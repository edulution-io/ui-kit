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
