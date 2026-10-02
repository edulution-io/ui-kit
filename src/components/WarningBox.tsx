/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import ItemList from './ItemList';

type WarningBoxVariant = 'warning' | 'error' | 'success' | 'info';

type WarningBoxLayout = 'block' | 'inline';

const LAYOUT_STYLES: Record<WarningBoxLayout, { box: string; icon: string; title: string; description: string }> = {
  block: {
    box: 'mb-4 rounded-lg p-3 flex flex-col items-center text-center',
    icon: 'mb-2 flex h-6 w-6 items-center justify-start',
    title: 'font-bold',
    description: 'text-sm',
  },
  inline: {
    box: 'rounded-md px-2.5 py-1 flex min-w-0 flex-row items-center gap-2 text-left',
    icon: 'flex h-4 w-4 shrink-0 items-center justify-center',
    title: 'shrink-0 text-sm font-semibold',
    description: 'min-w-0 truncate text-sm',
  },
};

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
  title?: string;
  description: string;
  filenames?: string[];
  variant?: WarningBoxVariant;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  layout?: WarningBoxLayout;
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
  layout = 'block',
}: WarningBoxProps) => {
  const variantStyles = variant ? VARIANT_STYLES[variant] : { borderColor: '', backgroundColor: '', textColor: '' };
  const resolvedBorderColor = borderColor ?? variantStyles.borderColor;
  const resolvedBackgroundColor = backgroundColor ?? variantStyles.backgroundColor;
  const resolvedTextColor = textColor ?? variantStyles.textColor;
  const layoutStyles = LAYOUT_STYLES[layout];

  return (
    <div
      className={`border ${resolvedBorderColor} ${resolvedBackgroundColor} ${resolvedTextColor} ${layoutStyles.box}`}
    >
      {icon && <div className={layoutStyles.icon}>{icon}</div>}
      {title && <p className={layoutStyles.title}>{title}</p>}
      <p className={layoutStyles.description}>{description}</p>
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
export type { WarningBoxLayout, WarningBoxProps, WarningBoxVariant };
