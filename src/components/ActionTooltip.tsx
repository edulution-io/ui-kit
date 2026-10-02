/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useEffect, useRef, useState } from 'react';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import cn from '../utils/cn';
import { Tooltip } from './Tooltip';

interface ActionTooltipProps {
  trigger: React.ReactNode;
  onAction?: () => void;
  tooltipText: string;
  className?: string;
  openOnSide?: 'top' | 'left' | 'bottom' | 'right';
}

const TOUCH_TOOLTIP_AUTO_CLOSE_MS = 1500;

const ActionTooltip: React.FC<ActionTooltipProps> = ({
  trigger,
  onAction,
  tooltipText,
  className,
  openOnSide = 'top',
}) => {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return;
    setOpen(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), TOUCH_TOOLTIP_AUTO_CLOSE_MS);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onAction) {
      onAction();
    }
  };

  return (
    <Tooltip
      open={open}
      onOpenChange={setOpen}
    >
      <TooltipTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={onAction}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
        >
          {trigger}
        </div>
      </TooltipTrigger>
      <TooltipContent
        className={cn('rounded-lg bg-accent p-2 shadow-xl', className)}
        side={openOnSide}
        align="center"
      >
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
};

export default ActionTooltip;
