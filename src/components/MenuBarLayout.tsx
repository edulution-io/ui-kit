/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import cn from '../utils/cn';

export type MenuBarLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpen?: boolean;
  isDesktop: boolean;
};

const MenuBarLayout = React.forwardRef<HTMLDivElement, MenuBarLayoutProps>(
  ({ isOpen = false, isDesktop, className, children, ...props }, ref) => {
    if (isDesktop) {
      return (
        <aside
          className="relative flex h-full min-h-0"
          {...props}
        >
          <div
            ref={ref}
            className={cn(
              'liquid-glass liquid-glass-panel h-full w-64 overflow-hidden !rounded-lg border-0 transition-all duration-300',
              className,
            )}
          >
            <div className="flex h-full min-h-0 max-w-[var(--menubar-max-width,300px)] flex-col">{children}</div>
          </div>
        </aside>
      );
    }

    return (
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-full transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            'liquid-glass liquid-glass-panel fixed left-0 h-full w-64 overflow-x-hidden !rounded-lg border-0',
            'pt-[var(--mobile-top-bar-height,0px)]',
            className,
          )}
        >
          <div className="flex h-full min-h-0 max-w-[var(--menubar-max-width,300px)] flex-col">{children}</div>
        </div>
      </div>
    );
  },
);

MenuBarLayout.displayName = 'MenuBarLayout';

export default MenuBarLayout;
