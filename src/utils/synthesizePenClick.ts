/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
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
