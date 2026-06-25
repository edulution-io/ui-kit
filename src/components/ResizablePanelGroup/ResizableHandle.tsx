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
import { Separator, type SeparatorProps } from 'react-resizable-panels';
import cn from '../../utils/cn';

const ResizableHandle: React.FC<SeparatorProps & { withHandle?: boolean }> = ({
  withHandle = false,
  className,
  children,
  ...props
}) => (
  <Separator
    className={cn(
      'relative flex w-px shrink-0 touch-none items-center justify-center bg-muted transition-colors',
      'hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 after:cursor-col-resize',
      'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full',
      'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:inset-y-auto',
      'aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:top-1/2',
      'aria-[orientation=horizontal]:after:h-3 aria-[orientation=horizontal]:after:w-full',
      'aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0',
      'aria-[orientation=horizontal]:after:cursor-row-resize',
      className,
    )}
    {...props}
  >
    {withHandle ? (
      <span
        aria-hidden
        className={cn(
          'z-10 flex h-6 w-3 items-center justify-center rounded-sm border border-muted bg-background',
          '[[aria-orientation=horizontal]_&]:h-3 [[aria-orientation=horizontal]_&]:w-6',
        )}
      >
        <span
          className={cn(
            'h-3 w-px bg-muted-foreground',
            '[[aria-orientation=horizontal]_&]:h-px [[aria-orientation=horizontal]_&]:w-3',
          )}
        />
      </span>
    ) : (
      children
    )}
  </Separator>
);

export default ResizableHandle;
