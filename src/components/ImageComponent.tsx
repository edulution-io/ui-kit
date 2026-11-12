/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useState } from 'react';
import cn from '../utils/cn';

export interface ImageComponentProps {
  downloadLink: string;
  altText: string;
  placeholder?: string;
  errorText: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ downloadLink, altText, placeholder, errorText }) => {
  const [src, setSrc] = useState(downloadLink);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (placeholder) {
      setSrc(placeholder);
    }
    setError(true);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <img
        src={src}
        alt={altText}
        onError={handleError}
        className={cn('max-h-full min-h-0 max-w-full border', error && 'border-colorDanger')}
      />
      {error && <p className="text-colorDanger">{errorText}</p>}
    </div>
  );
};

export default ImageComponent;
