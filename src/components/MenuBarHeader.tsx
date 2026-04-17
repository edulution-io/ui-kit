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

export type MenuBarHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: React.ReactNode;
  title: string;
  onHeaderClick: () => void;
};

const MenuBarHeader = React.forwardRef<HTMLDivElement, MenuBarHeaderProps>(
  ({ icon, title, onHeaderClick, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center py-6', className)}
      {...props}
    >
      <button
        className="flex flex-col items-center justify-center rounded-xl p-2 hover:bg-muted-background"
        type="button"
        onClick={onHeaderClick}
      >
        {icon}
        <h2 className="mb-2 mt-2 text-center font-bold">{title}</h2>
      </button>
    </div>
  ),
);

MenuBarHeader.displayName = 'MenuBarHeader';

export default MenuBarHeader;
