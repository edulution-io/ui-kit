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
import useResizablePanelLayout from './useResizablePanelLayout';

const useDefaultLayoutMock = vi.fn();

vi.mock('react-resizable-panels', () => ({
  useDefaultLayout: (args: { id: string; panelIds: string[] }) => useDefaultLayoutMock(args),
}));

beforeEach(() => {
  useDefaultLayoutMock.mockReset();
  useDefaultLayoutMock.mockReturnValue({ defaultLayout: undefined, onLayoutChanged: undefined });
});

describe('useResizablePanelLayout', () => {
  it('forwards id and panelIds to useDefaultLayout', () => {
    renderHook(() => useResizablePanelLayout('save-id', ['a', 'b']));

    expect(useDefaultLayoutMock).toHaveBeenCalledTimes(1);
    expect(useDefaultLayoutMock).toHaveBeenCalledWith({ id: 'save-id', panelIds: ['a', 'b'] });
  });

  it('returns whatever useDefaultLayout returns', () => {
    const layout = { defaultLayout: ['50%', '50%'], onLayoutChanged: vi.fn() };
    useDefaultLayoutMock.mockReturnValue(layout);

    const { result } = renderHook(() => useResizablePanelLayout('save-id', ['a', 'b']));

    expect(result.current).toBe(layout);
  });
});
