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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import type MenuBarItemAction from './MenuBarItemAction';

interface MenuBarItemActionsProps {
  actions: MenuBarItemAction[];
  label: string;
  className?: string;
}

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation();

const MenuBarItemActions: React.FC<MenuBarItemActionsProps> = ({ actions, label, className }) => {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="btn-ghost"
          aria-label={label}
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
          className={cn(
            'shrink-0 p-1 opacity-0 transition-opacity',
            'group-hover/menubar-row:opacity-100 data-[state=open]:opacity-100 focus-visible:opacity-100',
            '[@media(hover:none)]:opacity-100',
            className,
          )}
        >
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="h-4 w-4 shrink-0"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={stopPropagation}
      >
        {actions.map((action) => (
          <React.Fragment key={action.id}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              className={cn(
                'gap-2',
                action.isDestructive && 'text-destructive data-[highlighted]:text-destructive focus:text-destructive',
              )}
            >
              {action.icon && <span className="flex h-4 w-4 shrink-0 items-center justify-center">{action.icon}</span>}
              <span className="truncate">{action.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuBarItemActions;
