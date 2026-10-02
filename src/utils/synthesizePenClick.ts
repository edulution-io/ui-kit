/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type { PointerEvent as ReactPointerEvent } from 'react';

const NATIVE_CLICK_SUPPRESS_WINDOW_MS = 700;

const activeSuppressors = new WeakMap<HTMLElement, () => void>();
const synthesizingByTarget = new WeakMap<HTMLElement, { active: boolean }>();

const synthesizePenClick = (event: ReactPointerEvent<HTMLElement>): void => {
  if (event.defaultPrevented) return;
  if (event.pointerType !== 'pen') return;
  event.preventDefault();
  const target = event.currentTarget;

  activeSuppressors.get(target)?.();

  const controller = new AbortController();
  let timeoutId = 0;
  const synthesizing = synthesizingByTarget.get(target) ?? { active: false };
  synthesizingByTarget.set(target, synthesizing);

  const cleanup = () => {
    clearTimeout(timeoutId);
    controller.abort();
    if (activeSuppressors.get(target) === cleanup) {
      activeSuppressors.delete(target);
    }
  };

  const suppressEchoClick = (clickEvent: Event) => {
    if (synthesizing.active) {
      synthesizing.active = false;
      return;
    }
    clickEvent.stopPropagation();
    clickEvent.preventDefault();
    cleanup();
  };

  activeSuppressors.set(target, cleanup);
  target.addEventListener('click', suppressEchoClick, { capture: true, signal: controller.signal });
  timeoutId = window.setTimeout(cleanup, NATIVE_CLICK_SUPPRESS_WINDOW_MS);

  requestAnimationFrame(() => {
    if (!target.isConnected || (target as HTMLButtonElement).disabled) {
      cleanup();
      return;
    }
    synthesizing.active = true;
    try {
      target.click();
    } finally {
      synthesizing.active = false;
    }
  });
};

export default synthesizePenClick;
