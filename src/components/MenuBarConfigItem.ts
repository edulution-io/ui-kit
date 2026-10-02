/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type React from 'react';
import type MenuBarDropData from './MenuBarDropData';
import type MenuBarItemAction from './MenuBarItemAction';

interface MenuBarConfigItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  children?: MenuBarConfigItem[];
  badge?: number;
  /**
   * When true, this item's own badge is left out of a collapsed parent's
   * aggregated badge, while the item keeps showing it. Its children still count
   * unless they opt out themselves.
   */
  excludeFromBadgeAggregation?: boolean;
  groupLabel?: string;
  dropData?: MenuBarDropData;
  contextActions?: MenuBarItemAction[];
}

export default MenuBarConfigItem;
