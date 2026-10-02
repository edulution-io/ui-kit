/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type React from 'react';

interface MenuBarItemAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  separatorBefore?: boolean;
}

export default MenuBarItemAction;
