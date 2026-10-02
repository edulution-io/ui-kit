/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';

export interface DropZoneProps {
  onDrop: DropzoneOptions['onDrop'];
  accept?: Record<string, string[]>;
  dragActiveText: string;
  inactiveText: string;
  className?: string;
  minHeight?: string;
  getFilesFromEvent?: DropzoneOptions['getFilesFromEvent'];
  activeClassName?: string;
  inactiveClassName?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  accept,
  dragActiveText,
  inactiveText,
  className,
  minHeight = 'min-h-32',
  getFilesFromEvent,
  activeClassName = 'bg-accent-light',
  inactiveClassName = 'bg-background dark:bg-accent',
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    ...(getFilesFromEvent ? { getFilesFromEvent } : {}),
  });

  const dropzoneStyle = cn(
    'border-2 border-dashed border-muted dark:border-muted-foreground rounded-lg cursor-pointer',
    isDragActive ? activeClassName : inactiveClassName,
    className,
  );

  return (
    <div {...getRootProps({ className: dropzoneStyle })}>
      <input {...getInputProps()} />
      <div className={cn('flex flex-col items-center justify-center space-y-2 p-4', minHeight)}>
        <p className="text-wrap text-center text-sm text-muted-foreground">
          {isDragActive ? dragActiveText : inactiveText}
        </p>
        <FontAwesomeIcon
          icon={faCloudArrowUp}
          className="h-10 w-10 text-muted-foreground"
        />
      </div>
    </div>
  );
};

export default DropZone;
