/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type { HTMLAttributes } from 'react';
import { FC } from 'react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import formatCountBadge from '../utils/formatCountBadge';

interface IconWithCountProps extends HTMLAttributes<HTMLSpanElement> {
  icon: IconDefinition;
  count?: number;
  size?: SizeProp;
  badgeSize?: number;
  className?: string;
}

const IconWithCount: FC<IconWithCountProps> = ({
  icon,
  count = 0,
  size = 'lg',
  badgeSize = 16,
  className = '',
  ...rest
}) => {
  const badgePx = `${badgeSize}px`;
  const fontPx = `${Math.round(badgeSize * 0.6)}px`;

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ cursor: rest.onClick ? 'pointer' : undefined }}
      {...rest}
    >
      <FontAwesomeIcon
        icon={icon}
        size={size}
      />

      {count > 0 && (
        <span
          className="
            absolute -right-1 -top-1
            flex items-center justify-center
            rounded-full bg-primary font-semibold leading-none text-primary-foreground
          "
          style={{
            height: badgePx,
            minWidth: badgePx,
            fontSize: fontPx,
            padding: '0 2px',
          }}
        >
          {formatCountBadge(count)}
        </span>
      )}
    </span>
  );
};

export default IconWithCount;
