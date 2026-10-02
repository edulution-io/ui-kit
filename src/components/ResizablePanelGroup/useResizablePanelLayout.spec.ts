/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/**
 * @vitest-environment jsdom
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

  it('forwards the choice to save only layouts the user dragged', () => {
    renderHook(() => useResizablePanelLayout('save-id', ['a', 'b'], { onlySaveAfterUserInteractions: true }));

    expect(useDefaultLayoutMock).toHaveBeenCalledWith({
      id: 'save-id',
      panelIds: ['a', 'b'],
      onlySaveAfterUserInteractions: true,
    });
  });

  it('returns whatever useDefaultLayout returns', () => {
    const layout = { defaultLayout: ['50%', '50%'], onLayoutChanged: vi.fn() };
    useDefaultLayoutMock.mockReturnValue(layout);

    const { result } = renderHook(() => useResizablePanelLayout('save-id', ['a', 'b']));

    expect(result.current).toBe(layout);
  });
});
