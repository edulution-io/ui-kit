/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type React from 'react';

export const SELECTION_WIZARD_LAYOUTS = {
  COLUMNS: 'columns',
  STEPS: 'steps',
} as const;

export type SelectionWizardLayout = (typeof SELECTION_WIZARD_LAYOUTS)[keyof typeof SELECTION_WIZARD_LAYOUTS];

export const SELECTION_WIZARD_SHELLS = {
  INLINE: 'inline',
  DIALOG: 'dialog',
  ADAPTIVE: 'adaptive',
} as const;

export const SELECTION_WIZARD_RENDERED_SHELLS = {
  INLINE: 'inline',
  DIALOG: 'dialog',
  SHEET: 'sheet',
} as const;

export type SelectionWizardRenderedShell =
  (typeof SELECTION_WIZARD_RENDERED_SHELLS)[keyof typeof SELECTION_WIZARD_RENDERED_SHELLS];

export const resolveRenderedShell = (as: SelectionWizardShell, isMobileView: boolean): SelectionWizardRenderedShell => {
  if (as === SELECTION_WIZARD_SHELLS.DIALOG) return SELECTION_WIZARD_RENDERED_SHELLS.DIALOG;
  if (as === SELECTION_WIZARD_SHELLS.ADAPTIVE) {
    return isMobileView ? SELECTION_WIZARD_RENDERED_SHELLS.SHEET : SELECTION_WIZARD_RENDERED_SHELLS.DIALOG;
  }
  return SELECTION_WIZARD_RENDERED_SHELLS.INLINE;
};

export type SelectionWizardShell = (typeof SELECTION_WIZARD_SHELLS)[keyof typeof SELECTION_WIZARD_SHELLS];

export const SELECTION_WIZARD_STEP_STATES = {
  ACTIVE: 'active',
  DONE: 'done',
  OPEN: 'open',
  TODO: 'todo',
} as const;

export type SelectionWizardStepState = (typeof SELECTION_WIZARD_STEP_STATES)[keyof typeof SELECTION_WIZARD_STEP_STATES];

export interface SelectionWizardSecondaryAction {
  label: string;
  onSelect: () => void;
  isDisabled?: boolean;
}

export interface SelectionWizardStep {
  id: string;
  title: string;
  pickLabel?: string;
  pickIcon?: React.ReactNode;
  render: () => React.ReactNode;
  isComplete: boolean;
  isOptional?: boolean;
  secondaryAction?: SelectionWizardSecondaryAction;
  defaultSize?: number;
  minSize?: number;
}

export interface SelectionWizardLabels {
  back: string;
  next: string;
  submit?: string;
  cancel?: string;
  close?: string;
  pickPlaceholder?: string;
  resizeHandle?: string;
}

interface SelectionWizardBaseProps {
  steps: SelectionWizardStep[];
  activeStepId: string;
  onActiveStepChange: (stepId: string) => void;
  labels: SelectionWizardLabels;
  layout?: SelectionWizardLayout;
  isOpen?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: () => Promise<void> | void;
  autoSaveId?: string;
  maxColumns?: number;
  mobileBreakpointQuery?: string;
  className?: string;
  'data-testid'?: string;
}

interface SelectionWizardInlineProps extends SelectionWizardBaseProps {
  as?: typeof SELECTION_WIZARD_SHELLS.INLINE;
  title?: string;
}

interface SelectionWizardOverlayProps extends SelectionWizardBaseProps {
  as: typeof SELECTION_WIZARD_SHELLS.DIALOG | typeof SELECTION_WIZARD_SHELLS.ADAPTIVE;
  title: string;
}

export type SelectionWizardProps = SelectionWizardInlineProps | SelectionWizardOverlayProps;

export const SELECTION_WIZARD_DEFAULT_MAX_COLUMNS = 3;
export const SELECTION_WIZARD_DEFAULT_MIN_SIZE = 15;
export const SELECTION_WIZARD_PANEL_ID_PREFIX = 'selection-wizard-step-';
export const SELECTION_WIZARD_SUBMIT_ERROR_TAG = 'SelectionWizard: onSubmit rejected';
export const SELECTION_WIZARD_TEST_ID = 'selection-wizard';

export const panelIdOf = (stepId: string): string => `${SELECTION_WIZARD_PANEL_ID_PREFIX}${stepId}`;

export const isStepPassable = (step: SelectionWizardStep): boolean => step.isComplete || Boolean(step.isOptional);

export const isStepReachable = (steps: SelectionWizardStep[], index: number): boolean =>
  steps.slice(0, index).every(isStepPassable);

export const resolveStepState = (
  steps: SelectionWizardStep[],
  activeStepId: string,
  index: number,
): SelectionWizardStepState => {
  const step = steps[index];
  const activeIndex = steps.findIndex((entry) => entry.id === activeStepId);

  if (step.id === activeStepId) return SELECTION_WIZARD_STEP_STATES.ACTIVE;
  if (index < activeIndex && step.isComplete) return SELECTION_WIZARD_STEP_STATES.DONE;
  if (isStepReachable(steps, index)) return SELECTION_WIZARD_STEP_STATES.OPEN;
  return SELECTION_WIZARD_STEP_STATES.TODO;
};

export const canSubmit = (steps: SelectionWizardStep[]): boolean => steps.every(isStepPassable);

export const findAdjacentStepId = (
  steps: SelectionWizardStep[],
  activeStepId: string,
  offset: -1 | 1,
): string | null => {
  const activeIndex = steps.findIndex((entry) => entry.id === activeStepId);
  if (activeIndex < 0) return null;
  return steps[activeIndex + offset]?.id ?? null;
};

export const showsStepsSideBySide = (layout: SelectionWizardLayout, isMobileView: boolean): boolean =>
  !isMobileView && layout === SELECTION_WIZARD_LAYOUTS.COLUMNS;

export const resolveVisibleColumns = (
  steps: SelectionWizardStep[],
  activeStepId: string,
  maxColumns: number = SELECTION_WIZARD_DEFAULT_MAX_COLUMNS,
): SelectionWizardStep[] => {
  const columnCount = Math.max(1, Math.floor(maxColumns));
  if (steps.length <= columnCount) return steps;

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeStepId),
  );
  const lastPossibleStart = steps.length - columnCount;
  const start = Math.min(Math.max(0, activeIndex - (columnCount - 1)), lastPossibleStart);

  return steps.slice(start, start + columnCount);
};

export const persistentLayoutIdOf = (autoSaveId: string, steps: SelectionWizardStep[]): string =>
  `${autoSaveId}:${steps.map((step) => step.id).join('-')}`;

export const resolveColumnSizes = (steps: SelectionWizardStep[]): number[] => {
  const fixedTotal = steps.reduce((sum, step) => sum + (step.defaultSize ?? 0), 0);
  const flexibleCount = steps.filter((step) => step.defaultSize === undefined).length;
  const share = flexibleCount > 0 ? Math.max(0, 100 - fixedTotal) / flexibleCount : 0;

  return steps.map((step) => step.defaultSize ?? share);
};
