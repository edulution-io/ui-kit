/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useEffect, useRef, type RefObject } from 'react';

type RefOrRefs = RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];

const useOnClickOutside = (ref: RefOrRefs, handler: (event?: PointerEvent) => void): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const refsArray = Array.isArray(ref) ? ref : [ref];

  useEffect(() => {
    const listener = (event: PointerEvent) => {
      const hasAnyRef = refsArray.some((r) => r.current);
      if (!hasAnyRef) {
        return;
      }
      const isInside = refsArray.some((r) => r.current?.contains(event.target as Node));
      if (isInside) {
        return;
      }
      handlerRef.current(event);
    };

    document.addEventListener('pointerdown', listener);

    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, refsArray);
};

export default useOnClickOutside;
