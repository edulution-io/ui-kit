/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';

export interface FullScreenImageProps {
  imageSrc: string;
  altText: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ imageSrc, altText }) => (
  <div className="flex h-full w-full items-center justify-center bg-background">
    <img
      src={imageSrc}
      alt={altText}
      className="max-h-full max-w-full rounded-md"
    />
  </div>
);

export default FullScreenImage;
