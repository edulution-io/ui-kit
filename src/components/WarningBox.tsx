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
import ItemList from './ItemList';

type WarningBoxVariant = 'warning' | 'error' | 'success' | 'info';

const VARIANT_STYLES: Record<WarningBoxVariant, { borderColor: string; backgroundColor: string; textColor: string }> = {
  warning: {
    borderColor: 'border-colorWarningLight',
    backgroundColor: 'bg-colorWarningLight/10',
    textColor: 'text-amber-700 dark:text-colorWarningLight',
  },
  error: {
    borderColor: 'border-colorDanger',
    backgroundColor: 'bg-colorDanger/10',
    textColor: 'text-colorDanger dark:text-colorDangerLight',
  },
  success: {
    borderColor: 'border-colorSuccess',
    backgroundColor: 'bg-colorSuccess/10',
    textColor: 'text-colorSuccess',
  },
  info: {
    borderColor: 'border-ciDarkBlue',
    backgroundColor: 'bg-ciDarkBlue/10',
    textColor: 'text-ciDarkBlue',
  },
};

interface WarningBoxProps {
  title: string;
  description: string;
  filenames?: string[];
  variant?: WarningBoxVariant;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}

const WarningBox: React.FC<WarningBoxProps> = ({
  title,
  description,
  filenames,
  variant,
  borderColor,
  backgroundColor,
  textColor,
  icon,
}: WarningBoxProps) => {
  const variantStyles = variant ? VARIANT_STYLES[variant] : { borderColor: '', backgroundColor: '', textColor: '' };
  const resolvedBorderColor = borderColor ?? variantStyles.borderColor;
  const resolvedBackgroundColor = backgroundColor ?? variantStyles.backgroundColor;
  const resolvedTextColor = textColor ?? variantStyles.textColor;

  return (
    <div
      className={`
        mb-4 rounded-lg border ${resolvedBorderColor} ${resolvedBackgroundColor} p-3 ${resolvedTextColor}
        flex flex-col items-center text-center
      `}
    >
      {icon && <div className="mb-2 flex h-6 w-6 items-center justify-start">{icon}</div>}
      <p className="font-bold">{title}</p>
      <p className="text-sm">{description}</p>
      {filenames && filenames.length > 0 && (
        <ItemList
          layout="inline"
          items={filenames.map((name) => ({ id: name, name }))}
        />
      )}
    </div>
  );
};

export default WarningBox;
export type { WarningBoxProps, WarningBoxVariant };
