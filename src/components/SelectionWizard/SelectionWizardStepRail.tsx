/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import cn from '../../utils/cn';
import {
  resolveStepState,
  SELECTION_WIZARD_STEP_STATES,
  type SelectionWizardStep,
  type SelectionWizardStepState,
} from './selectionWizardInternals';

interface SelectionWizardStepRailProps {
  steps: SelectionWizardStep[];
  activeStepId: string;
  onActiveStepChange: (stepId: string) => void;
  pickPlaceholder?: string;
}

const NON_BREAKING_SPACE = ' ';

const STEP_BUTTON_CLASSES =
  'flex shrink-0 items-center gap-2 rounded-full border border-transparent py-1 pl-1.5 pr-3 text-left text-sm text-muted-foreground transition-colors';

const STEP_BUTTON_STATE_CLASSES: Record<SelectionWizardStepState, string> = {
  active: 'border-accent-light bg-muted-light/60 text-foreground',
  done: 'text-foreground hover:bg-muted-light/60',
  open: 'text-foreground hover:bg-muted-light/60',
  todo: 'cursor-not-allowed opacity-50',
};

const STEP_NUMBER_CLASSES =
  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent-light text-[11px] font-bold tabular-nums';

const STEP_NUMBER_STATE_CLASSES: Record<SelectionWizardStepState, string> = {
  active: 'border-primary bg-primary text-primary-foreground',
  done: 'border-ciLightGreen bg-ciLightGreen text-primary-foreground',
  open: '',
  todo: '',
};

const renderDoneMark = (step: SelectionWizardStep) =>
  step.pickIcon ?? (
    <FontAwesomeIcon
      icon={faCheck}
      className="h-2.5 w-2.5"
    />
  );

const SelectionWizardStepRail: React.FC<SelectionWizardStepRailProps> = ({
  steps,
  activeStepId,
  onActiveStepChange,
  pickPlaceholder,
}) => {
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const activeButton = activeButtonRef.current;
    if (activeButton && typeof activeButton.scrollIntoView === 'function') {
      activeButton.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }, [activeStepId]);

  return (
    <ol
      className="flex items-center gap-1 overflow-x-auto scrollbar-thin"
      data-testid="selection-wizard-step-rail"
    >
      {steps.map((step, index) => {
        const state = resolveStepState(steps, activeStepId, index);
        const isActive = state === SELECTION_WIZARD_STEP_STATES.ACTIVE;
        const isDone = state === SELECTION_WIZARD_STEP_STATES.DONE;
        const isLocked = state === SELECTION_WIZARD_STEP_STATES.TODO;

        return (
          <li
            key={step.id}
            className="flex shrink-0 items-center gap-1"
          >
            {index > 0 && (
              <FontAwesomeIcon
                icon={faChevronRight}
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 text-muted-foreground/60"
              />
            )}
            <button
              ref={isActive ? activeButtonRef : undefined}
              type="button"
              data-testid={`selection-wizard-step-${step.id}`}
              data-state={state}
              aria-current={isActive ? 'step' : undefined}
              disabled={isLocked}
              onClick={() => {
                if (!isActive) onActiveStepChange(step.id);
              }}
              className={cn(STEP_BUTTON_CLASSES, STEP_BUTTON_STATE_CLASSES[state])}
            >
              <span className={cn(STEP_NUMBER_CLASSES, STEP_NUMBER_STATE_CLASSES[state])}>
                {isDone && renderDoneMark(step)}
                {!isDone && index + 1}
              </span>
              <span className="flex flex-col items-start whitespace-nowrap leading-tight">
                <span>{step.title}</span>
                <span
                  data-testid={`selection-wizard-pick-${step.id}`}
                  data-placeholder={step.pickLabel ? undefined : 'true'}
                  className={cn('text-xs', step.pickLabel ? 'text-muted-foreground' : 'text-muted-foreground/60')}
                >
                  {step.pickLabel ?? pickPlaceholder ?? NON_BREAKING_SPACE}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default SelectionWizardStepRail;
