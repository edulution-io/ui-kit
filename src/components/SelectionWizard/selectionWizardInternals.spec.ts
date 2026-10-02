/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import {
  canSubmit,
  findAdjacentStepId,
  isStepReachable,
  persistentLayoutIdOf,
  resolveColumnSizes,
  resolveRenderedShell,
  resolveStepState,
  resolveVisibleColumns,
  showsStepsSideBySide,
  type SelectionWizardStep,
} from './selectionWizardInternals';

const step = (id: string, overrides: Partial<SelectionWizardStep> = {}): SelectionWizardStep => ({
  id,
  title: id,
  render: () => null,
  isComplete: false,
  ...overrides,
});

describe('selectionWizardInternals', () => {
  describe('resolveStepState', () => {
    it('marks the active step, a passed complete step as done and a step behind an incomplete one as locked', () => {
      const steps = [step('a', { isComplete: true }), step('b'), step('c')];

      expect(resolveStepState(steps, 'b', 0)).toBe('done');
      expect(resolveStepState(steps, 'b', 1)).toBe('active');
      expect(resolveStepState(steps, 'b', 2)).toBe('todo');
    });

    it('never shows a step ahead of the active one as done, even when it is complete', () => {
      const steps = [step('a'), step('b'), step('c', { isComplete: true })];

      expect(resolveStepState(steps, 'a', 2)).toBe('todo');
    });

    it('offers a later step as open once every step before it can be passed', () => {
      const steps = [step('a', { isComplete: true }), step('b', { isOptional: true }), step('c')];

      expect(resolveStepState(steps, 'a', 1)).toBe('open');
      expect(resolveStepState(steps, 'a', 2)).toBe('open');
    });

    it('shows a passed step that lost its completion as open, not as done', () => {
      const steps = [step('a'), step('b')];

      expect(resolveStepState(steps, 'b', 0)).toBe('open');
    });
  });

  describe('isStepReachable', () => {
    it('treats an optional step like a complete one', () => {
      const steps = [step('a', { isOptional: true }), step('b')];

      expect(isStepReachable(steps, 1)).toBe(true);
    });

    it('blocks a step behind an incomplete required one', () => {
      const steps = [step('a'), step('b')];

      expect(isStepReachable(steps, 1)).toBe(false);
    });
  });

  describe('canSubmit', () => {
    it('needs every required step complete and lets optional ones pass', () => {
      expect(canSubmit([step('a', { isComplete: true }), step('b', { isOptional: true })])).toBe(true);
      expect(canSubmit([step('a', { isComplete: true }), step('b')])).toBe(false);
    });
  });

  describe('findAdjacentStepId', () => {
    const steps = [step('a'), step('b'), step('c')];

    it('finds the neighbours and returns null at both ends', () => {
      expect(findAdjacentStepId(steps, 'b', -1)).toBe('a');
      expect(findAdjacentStepId(steps, 'b', 1)).toBe('c');
      expect(findAdjacentStepId(steps, 'a', -1)).toBeNull();
      expect(findAdjacentStepId(steps, 'c', 1)).toBeNull();
    });

    it('returns null for an unknown active step', () => {
      expect(findAdjacentStepId(steps, 'zzz', 1)).toBeNull();
    });
  });

  describe('showsStepsSideBySide', () => {
    it('lays the steps side by side on desktop in the columns layout', () => {
      expect(showsStepsSideBySide('columns', false)).toBe(true);
    });

    it('falls back to one step at a time on mobile or in the steps layout', () => {
      expect(showsStepsSideBySide('columns', true)).toBe(false);
      expect(showsStepsSideBySide('steps', false)).toBe(false);
    });
  });

  describe('resolveVisibleColumns', () => {
    const five = ['a', 'b', 'c', 'd', 'e'].map((id) => step(id));

    it('shows every step while they fit', () => {
      expect(resolveVisibleColumns(five.slice(0, 3), 'b', 3).map((s) => s.id)).toEqual(['a', 'b', 'c']);
    });

    it('slides a window of the given width that ends at the active step', () => {
      expect(resolveVisibleColumns(five, 'e', 3).map((s) => s.id)).toEqual(['c', 'd', 'e']);
      expect(resolveVisibleColumns(five, 'd', 3).map((s) => s.id)).toEqual(['b', 'c', 'd']);
    });

    it('fills the window from the start while the active step is still near the beginning', () => {
      expect(resolveVisibleColumns(five, 'a', 3).map((s) => s.id)).toEqual(['a', 'b', 'c']);
      expect(resolveVisibleColumns(five, 'b', 3).map((s) => s.id)).toEqual(['a', 'b', 'c']);
    });

    it('never shows fewer than one column, whatever the caller asks for', () => {
      expect(resolveVisibleColumns(five, 'c', 0).map((s) => s.id)).toEqual(['c']);
    });

    it('starts at the first step for an unknown active step', () => {
      expect(resolveVisibleColumns(five, 'zzz', 2).map((s) => s.id)).toEqual(['a', 'b']);
    });
  });

  describe('persistentLayoutIdOf', () => {
    it('keys the saved widths by the steps that are on screen, so a different window does not inherit them', () => {
      expect(persistentLayoutIdOf('lesson', [step('a'), step('b')])).toBe('lesson:a-b');
      expect(persistentLayoutIdOf('lesson', [step('b'), step('c'), step('d')])).toBe('lesson:b-c-d');
    });
  });

  describe('resolveColumnSizes', () => {
    it('splits the width evenly when no step asks for a size', () => {
      expect(resolveColumnSizes([step('a'), step('b')])).toEqual([50, 50]);
    });

    it('gives fixed steps their size and shares the rest among the others', () => {
      expect(resolveColumnSizes([step('a', { defaultSize: 30 }), step('b'), step('c')])).toEqual([30, 35, 35]);
    });

    it('never hands out a negative share when fixed sizes already fill the width', () => {
      expect(resolveColumnSizes([step('a', { defaultSize: 60 }), step('b', { defaultSize: 50 }), step('c')])).toEqual([
        60, 50, 0,
      ]);
    });
  });
});

describe('resolveRenderedShell', () => {
  it.each([
    ['inline', false, 'inline'],
    ['inline', true, 'inline'],
    ['dialog', false, 'dialog'],
    ['dialog', true, 'dialog'],
    ['adaptive', false, 'dialog'],
    ['adaptive', true, 'sheet'],
  ] as const)('renders as=%s with isMobileView=%s as a %s', (as, isMobileView, rendered) => {
    expect(resolveRenderedShell(as, isMobileView)).toBe(rendered);
  });
});
