/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useEffect, useState } from 'react';

const computeInset = (): number => {
  if (typeof window === 'undefined' || !window.visualViewport) {
    return 0;
  }
  const viewport = window.visualViewport;
  return Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop));
};

const useKeyboardInset = (): number => {
  const [inset, setInset] = useState<number>(() => computeInset());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) {
      return undefined;
    }

    const viewport = window.visualViewport;
    const update = () => setInset(computeInset());

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
};

export default useKeyboardInset;
