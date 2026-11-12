/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type MenuBarConfigItem from '../components/MenuBarConfigItem';

const sumChildBadges = (items?: MenuBarConfigItem[]): number =>
  items?.reduce(
    (acc, item) => acc + (item.excludeFromBadgeAggregation ? 0 : (item.badge ?? 0)) + sumChildBadges(item.children),
    0,
  ) ?? 0;

export default sumChildBadges;
