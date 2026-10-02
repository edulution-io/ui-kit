/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import Progress from './Progress';
import cn from '../utils/cn';

export interface ProgressBoxData {
  percent?: number;
  title?: string;
  description?: string;
  statusText?: string;
  id: string | number;
}

export interface ProgressBoxProps {
  data: ProgressBoxData;
}

const ProgressBox: React.FC<ProgressBoxProps> = ({ data }) => {
  const { percent, title, description, statusText } = data;
  const isIndeterminate = percent === undefined;

  return (
    <div className="flex flex-col gap-2">
      {title && <h1 className="text-sm font-bold">{title}</h1>}

      <div className="flex items-center gap-2">
        <Progress
          value={percent}
          className={cn(isIndeterminate && 'animate-pulse')}
        />
        {!isIndeterminate && <span className="whitespace-nowrap text-sm">{percent}%</span>}
      </div>

      {description && <p className="text-sm">{description}</p>}

      {statusText && <p className="text-sm">{statusText}</p>}
    </div>
  );
};

export default ProgressBox;
