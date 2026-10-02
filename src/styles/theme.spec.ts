/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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
