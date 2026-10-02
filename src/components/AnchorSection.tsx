/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { FC, ReactNode } from 'react';
import cn from '../utils/cn';

interface AnchorSectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

const AnchorSection: FC<AnchorSectionProps> = ({ id, className, children }) => (
  <section
    id={id}
    className={cn('scroll-mt-20', className)}
  >
    {children}
  </section>
);

export default AnchorSection;
