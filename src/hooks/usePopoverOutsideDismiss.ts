/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { type RefObject } from 'react';
import useOnClickOutside from './useOnClickOutside';

const POPPER_CONTENT_SELECTOR = '[data-radix-popper-content-wrapper]';

const usePopoverOutsideDismiss = (anchorRef: RefObject<HTMLElement | null>, onDismiss: () => void): void => {
  useOnClickOutside(anchorRef, (event) => {
    const target = event?.target;
    if (target instanceof Element && target.closest(POPPER_CONTENT_SELECTOR)) return;
    onDismiss();
  });
};

export default usePopoverOutsideDismiss;
