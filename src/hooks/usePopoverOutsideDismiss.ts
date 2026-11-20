/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { type RefObject } from 'react';
import useOnClickOutside from './useOnClickOutside';

const POPPER_CONTENT_SELECTOR = '[data-radix-popper-content-wrapper]';

const usePopoverOutsideDismiss = (
  anchorRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  ignoredSelector?: string,
): void => {
  const keptOpenSelector = ignoredSelector ? `${POPPER_CONTENT_SELECTOR}, ${ignoredSelector}` : POPPER_CONTENT_SELECTOR;
  useOnClickOutside(anchorRef, (event) => {
    const target = event?.target;
    if (target instanceof Element && target.closest(keptOpenSelector)) return;
    onDismiss();
  });
};

export default usePopoverOutsideDismiss;
