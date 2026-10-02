/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { describe, expect, it } from 'vitest';
import keyboardInsetStyle from './keyboardInsetStyle';

describe('keyboardInsetStyle', () => {
  it('lifts a bottom sheet above the keyboard and shrinks it to the space left', () => {
    expect(keyboardInsetStyle(320)).toEqual({ bottom: 320, maxHeight: 'calc(100vh - 320px)' });
  });

  it('leaves the sheet where it is while no keyboard covers the viewport', () => {
    expect(keyboardInsetStyle(0)).toBeUndefined();
  });
});
