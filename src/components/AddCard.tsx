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
