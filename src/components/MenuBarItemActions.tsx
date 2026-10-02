/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
              className="gap-2"
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
