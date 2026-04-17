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

import { useEffect, useRef, type RefObject } from 'react';

type RefOrRefs = RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];

const useOnClickOutside = (ref: RefOrRefs, handler: (event?: MouseEvent | TouchEvent) => void): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const refsArray = Array.isArray(ref) ? ref : [ref];

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
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

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, refsArray);
};

export default useOnClickOutside;
