/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { forwardRef, useId } from 'react';
import cn from '../utils/cn';

type FileSelectButtonProps = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  hasSelection?: boolean;
  chooseText?: React.ReactNode;
  changeText?: React.ReactNode;
  labelClassName?: string;
  inputId?: string;
};

const FileSelectButton = forwardRef<HTMLInputElement, FileSelectButtonProps>(
  (
    {
      onChange,
      accept = 'image/*',
      multiple = false,
      disabled = false,
      hasSelection = false,
      chooseText = '',
      changeText = '',
      labelClassName = '',
      inputId,
    },
    ref,
  ) => {
    const autoId = useId();
    const id = inputId ?? `file-select-${autoId}`;

    return (
      <>
        <input
          id={id}
          ref={ref}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center rounded-lg border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
            disabled && 'cursor-not-allowed opacity-50',
            labelClassName,
          )}
        >
          {hasSelection ? changeText : chooseText}
        </label>
      </>
    );
  },
);

FileSelectButton.displayName = 'FileSelectButton';
export default FileSelectButton;
export type { FileSelectButtonProps };
