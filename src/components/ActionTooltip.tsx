/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TooltipContent, TooltipPortal, TooltipTrigger } from '@radix-ui/react-tooltip';
import cn from '../utils/cn';
import TABBABLE_SELECTOR from '../constants/tabbableSelector';
import { Tooltip } from './Tooltip';

interface ActionTooltipProps {
  trigger: React.ReactNode;
  onAction?: () => void;
  tooltipText: string;
  className?: string;
  openOnSide?: 'top' | 'left' | 'bottom' | 'right';
}

const TOUCH_TOOLTIP_AUTO_CLOSE_MS = 1500;

const NATIVE_CONTROL_SELECTOR = 'a[href], button, input, select, textarea, summary';

const ActionTooltip: React.FC<ActionTooltipProps> = ({
  trigger,
  onAction,
  tooltipText,
  className,
  openOnSide = 'top',
}) => {
  const [open, setOpen] = useState(false);
  const [isTriggerTabbable, setIsTriggerTabbable] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setIsTriggerTabbable(Boolean(triggerRef.current?.querySelector(TABBABLE_SELECTOR)));
  }, [trigger]);

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
    if (event.target instanceof Element && event.target.matches(NATIVE_CONTROL_SELECTOR)) return;

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
        {isTriggerTabbable ? (
          <div
            ref={triggerRef}
            role="presentation"
            onClick={onAction}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
          >
            {trigger}
          </div>
        ) : (
          <div
            ref={triggerRef}
            role="button"
            tabIndex={0}
            onClick={onAction}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
          >
            {trigger}
          </div>
        )}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          className={cn('z-50 rounded-lg bg-accent p-2 shadow-xl', className)}
          side={openOnSide}
          align="center"
        >
          {tooltipText}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export default ActionTooltip;
