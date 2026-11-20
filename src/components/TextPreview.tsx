/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import cn from '../utils/cn';

interface TextPreviewProps {
  content: string;
  className?: string;
  contentId?: string;
  'data-testid'?: string;
}

const TextPreview = ({ content, className, contentId, 'data-testid': testId }: TextPreviewProps) => (
  <pre
    id={contentId}
    data-testid={testId}
    className={cn('whitespace-pre-wrap break-words p-2 font-mono', className)}
  >
    {content}
  </pre>
);

export default TextPreview;
export type { TextPreviewProps };
