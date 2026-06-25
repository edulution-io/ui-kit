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

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const themeCssPath = [
  resolve(process.cwd(), '../../libs/ui-kit/src/styles/theme.css'),
  resolve(process.cwd(), 'libs/ui-kit/src/styles/theme.css'),
].find((path) => existsSync(path));
const themeCss = readFileSync(themeCssPath ?? '', 'utf-8');

describe('liquid glass panel theme styles', () => {
  it('keeps panel backgrounds more specific than Tailwind background utilities', () => {
    expect(themeCss).toContain('html :is(.liquid-glass-panel, .liquid-glass.liquid-glass-panel)');
    expect(themeCss).toContain('.light :is(.liquid-glass-panel, .liquid-glass.liquid-glass-panel)');
  });

  it('prefixes every backdrop-filter declaration with -webkit-backdrop-filter for Safari', () => {
    const lines = themeCss.split('\n');
    const declarationIndexes = lines.reduce<number[]>((indexes, line, index) => {
      if (/^\s*backdrop-filter\s*:/.test(line)) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    expect(declarationIndexes.length).toBeGreaterThan(0);

    declarationIndexes.forEach((index) => {
      const previousLine = lines[index - 1] ?? '';
      expect(previousLine, `missing -webkit-backdrop-filter before "${lines[index].trim()}"`).toMatch(
        /^\s*-webkit-backdrop-filter\s*:/,
      );
    });
  });
});
