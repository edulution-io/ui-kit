/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { Group, type GroupProps } from 'react-resizable-panels';
import cn from '../../utils/cn';

const ResizablePanelGroup: React.FC<GroupProps> = ({ className, orientation, ...props }) => (
  <Group
    orientation={orientation ?? 'horizontal'}
    className={cn('flex h-full w-full', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)}
    {...props}
  />
);

export default ResizablePanelGroup;
