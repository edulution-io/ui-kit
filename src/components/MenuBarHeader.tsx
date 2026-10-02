/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import cn from '../utils/cn';

export type MenuBarHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode;
  title: string;
  onHeaderClick: () => void;
};

const MenuBarHeader = React.forwardRef<HTMLDivElement, MenuBarHeaderProps>(
  ({ icon: _icon, title, onHeaderClick, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-stretch pb-6 pt-2 lg:pt-4', className)}
      {...props}
    >
      <button
        className="flex h-10 w-full items-center justify-center px-3 text-center"
        type="button"
        onClick={onHeaderClick}
      >
        <h2 className="truncate text-base font-semibold leading-none md:text-lg">{title}</h2>
      </button>
    </div>
  ),
);

MenuBarHeader.displayName = 'MenuBarHeader';

export default MenuBarHeader;
