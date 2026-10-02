/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import cn from '../utils/cn';

export type MenuBarItemListProps = React.HTMLAttributes<HTMLDivElement>;

const MenuBarItemList = React.forwardRef<HTMLDivElement, MenuBarItemListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain pb-10', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

MenuBarItemList.displayName = 'MenuBarItemList';

export default MenuBarItemList;
