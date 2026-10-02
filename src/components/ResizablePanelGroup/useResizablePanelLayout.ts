/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useDefaultLayout } from 'react-resizable-panels';

type ResizablePanelLayoutOptions = Pick<Parameters<typeof useDefaultLayout>[0], 'onlySaveAfterUserInteractions'>;

const useResizablePanelLayout = (id: string, panelIds: string[], options?: ResizablePanelLayoutOptions) =>
  useDefaultLayout({ id, panelIds, ...options });

export default useResizablePanelLayout;
