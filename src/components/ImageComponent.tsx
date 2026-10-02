/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useState } from 'react';

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
    <div className="relative w-full">
      <img
        src={src}
        alt={altText}
        onError={handleError}
        className={`h-auto w-full ${error ? 'border-text-colorDanger border' : 'border'}`}
      />
      {error && <p className="text-text-colorDanger">{errorText}</p>}
    </div>
  );
};

export default ImageComponent;
