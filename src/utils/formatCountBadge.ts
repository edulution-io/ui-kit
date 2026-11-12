/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const COUNT_BADGE_MAX = 99;

const formatCountBadge = (count: number, max: number = COUNT_BADGE_MAX): string =>
  count > max ? `${max}+` : String(count);

export { COUNT_BADGE_MAX };
export default formatCountBadge;
