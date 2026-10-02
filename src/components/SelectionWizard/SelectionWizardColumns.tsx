/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, useResizablePanelLayout } from '../ResizablePanelGroup';
import { toPercent } from '../SplitPane/splitPaneInternals';
import {
  panelIdOf,
  resolveColumnSizes,
  SELECTION_WIZARD_DEFAULT_MIN_SIZE,
  type SelectionWizardStep,
} from './selectionWizardInternals';

type LayoutHookResult = ReturnType<typeof useResizablePanelLayout>;

export interface SelectionWizardColumnsProps {
  steps: SelectionWizardStep[];
  activeStepId: string;
  resizeHandleLabel?: string;
  defaultLayout?: LayoutHookResult['defaultLayout'];
  onLayoutChanged?: LayoutHookResult['onLayoutChanged'];
}

const SelectionWizardColumns: React.FC<SelectionWizardColumnsProps> = ({
  steps,
  activeStepId,
  resizeHandleLabel,
  defaultLayout,
  onLayoutChanged,
}) => {
  const sizes = resolveColumnSizes(steps);

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      className="h-full min-h-0 w-full"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && <ResizableHandle aria-label={resizeHandleLabel} />}
          <ResizablePanel
            id={panelIdOf(step.id)}
            defaultSize={toPercent(sizes[index])}
            minSize={toPercent(step.minSize ?? SELECTION_WIZARD_DEFAULT_MIN_SIZE)}
            className="flex h-full min-h-0 flex-col"
          >
            <div
              data-testid={`selection-wizard-column-${step.id}`}
              data-active={step.id === activeStepId}
              className="flex h-full min-h-0 flex-col"
            >
              {step.render()}
            </div>
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default SelectionWizardColumns;
