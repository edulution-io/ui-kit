/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { Button } from '../Button';
import {
  canSubmit,
  findAdjacentStepId,
  isStepPassable,
  type SelectionWizardLabels,
  type SelectionWizardStep,
} from './selectionWizardInternals';

interface SelectionWizardFooterProps {
  steps: SelectionWizardStep[];
  activeStepId: string;
  labels: SelectionWizardLabels;
  onActiveStepChange: (stepId: string) => void;
  showsNavigation: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const SelectionWizardFooter: React.FC<SelectionWizardFooterProps> = ({
  steps,
  activeStepId,
  labels,
  onActiveStepChange,
  showsNavigation,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const activeStep = steps.find((step) => step.id === activeStepId);
  const previousStepId = findAdjacentStepId(steps, activeStepId, -1);
  const nextStepId = findAdjacentStepId(steps, activeStepId, 1);
  const isLastStep = nextStepId === null;

  const showsBack = showsNavigation && previousStepId !== null;
  const showsNext = showsNavigation && nextStepId !== null;
  const showsSubmit = Boolean(onSubmit && labels.submit) && (!showsNavigation || isLastStep);
  const showsCancel = Boolean(onCancel && labels.cancel);
  const secondaryAction = activeStep?.secondaryAction;

  const hasContent = showsBack || showsNext || showsSubmit || showsCancel || Boolean(secondaryAction);
  if (!hasContent) return null;

  return (
    <div
      data-testid="selection-wizard-footer"
      className="flex flex-wrap items-center gap-2 border-t border-accent-light px-4 py-3"
    >
      <div className="ml-auto flex flex-wrap items-center justify-end gap-4">
        {showsCancel && (
          <Button
            type="button"
            variant="btn-outline"
            size="lg"
            data-testid="selection-wizard-cancel"
            onClick={onCancel}
          >
            {labels.cancel}
          </Button>
        )}
        {showsBack && (
          <Button
            type="button"
            variant="btn-outline"
            size="lg"
            data-testid="selection-wizard-back"
            onClick={() => onActiveStepChange(previousStepId)}
          >
            {labels.back}
          </Button>
        )}
        {secondaryAction && (
          <Button
            type="button"
            variant="btn-outline"
            size="lg"
            data-testid="selection-wizard-secondary-action"
            disabled={secondaryAction.isDisabled}
            onClick={secondaryAction.onSelect}
          >
            {secondaryAction.label}
          </Button>
        )}
        {showsNext && (
          <Button
            type="button"
            variant="btn-collaboration"
            size="lg"
            data-testid="selection-wizard-next"
            disabled={!activeStep || !isStepPassable(activeStep)}
            onClick={() => onActiveStepChange(nextStepId)}
          >
            {labels.next}
          </Button>
        )}
        {showsSubmit && (
          <Button
            type="button"
            variant="btn-collaboration"
            size="lg"
            data-testid="selection-wizard-submit"
            disabled={isSubmitting || !canSubmit(steps)}
            onClick={onSubmit}
          >
            {labels.submit}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectionWizardFooter;
