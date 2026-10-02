/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type { CSSProperties } from 'react';

const keyboardInsetStyle = (inset: number): CSSProperties | undefined =>
  inset > 0 ? { bottom: inset, maxHeight: `calc(100vh - ${inset}px)` } : undefined;

export default keyboardInsetStyle;
