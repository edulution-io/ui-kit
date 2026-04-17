/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
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
          className="relative flex h-dvh"
          {...props}
        >
          <div
            ref={ref}
            className={cn(
              'bg-glass h-full w-64 overflow-hidden rounded-r-xl shadow-lg shadow-slate-400 backdrop-blur-lg transition-all duration-300',
              className,
            )}
          >
            <div className="flex h-full max-w-[var(--menubar-max-width,300px)] flex-col">{children}</div>
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
            'bg-glass fixed left-0 h-full w-64 overflow-x-hidden border-r-[1px] border-muted backdrop-blur-md',
            className,
          )}
        >
          <div className="flex h-full max-w-[var(--menubar-max-width,300px)] flex-col">{children}</div>
        </div>
      </div>
    );
  },
);

MenuBarLayout.displayName = 'MenuBarLayout';

export default MenuBarLayout;
