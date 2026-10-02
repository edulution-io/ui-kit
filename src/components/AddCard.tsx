/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { Button } from './Button';
import cn from '../utils/cn';
import { SECTION_CARD_STYLES } from '../constants/sectionCardStyles';

interface AddCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

const AddCard: React.FC<AddCardProps> = ({ icon, title, description, className, iconClassName, ...props }) => (
  <Button
    type="button"
    size="none"
    className={cn(
      SECTION_CARD_STYLES.surfaceBase,
      SECTION_CARD_STYLES.variantBackground.default,
      'group h-full w-full items-center justify-center gap-3 whitespace-normal p-6 text-center',
      className,
    )}
    {...props}
  >
    {icon != null && (
      <span
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-lg bg-accent text-2xl text-ciLightGreen transition-transform duration-300 group-hover:scale-105',
          iconClassName,
        )}
      >
        {icon}
      </span>
    )}
    <span className="text-lg font-semibold text-foreground">{title}</span>
    {description != null && (
      <span className="max-w-[24rem] text-sm font-normal text-muted-foreground">{description}</span>
    )}
  </Button>
);

export default AddCard;
export type { AddCardProps };
