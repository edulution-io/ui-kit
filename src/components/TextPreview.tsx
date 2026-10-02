/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import cn from '../utils/cn';

interface TextPreviewProps {
  content: string;
  className?: string;
  contentId?: string;
}

const TextPreview = ({ content, className, contentId }: TextPreviewProps) => (
  <pre
    id={contentId}
    className={cn('whitespace-pre-wrap break-words p-2 font-mono', className)}
  >
    {content}
  </pre>
);

export default TextPreview;
export type { TextPreviewProps };
