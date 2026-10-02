/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import cn from '../utils/cn';

interface MenuBarItemGroupLabelProps {
  label: string;
  withSeparator?: boolean;
}

const SECTION_HEADING_LEVEL = 2;

const MenuBarItemGroupLabel: React.FC<MenuBarItemGroupLabelProps> = ({ label, withSeparator = false }) => (
  <div
    role="heading"
    aria-level={SECTION_HEADING_LEVEL}
    className={cn('px-4 pb-1 pt-3', withSeparator && 'mt-2 border-t border-muted pt-4')}
  >
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
  </div>
);

export default MenuBarItemGroupLabel;
