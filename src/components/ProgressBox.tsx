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
