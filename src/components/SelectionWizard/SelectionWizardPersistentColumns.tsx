/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { useResizablePanelLayout } from '../ResizablePanelGroup';
import SelectionWizardColumns, { type SelectionWizardColumnsProps } from './SelectionWizardColumns';
import { panelIdOf, persistentLayoutIdOf } from './selectionWizardInternals';

interface SelectionWizardPersistentColumnsProps
  extends Omit<SelectionWizardColumnsProps, 'defaultLayout' | 'onLayoutChanged'> {
  autoSaveId: string;
}

const SelectionWizardPersistentColumns: React.FC<SelectionWizardPersistentColumnsProps> = ({
  autoSaveId,
  steps,
  ...columns
}) => {
  const { defaultLayout, onLayoutChanged } = useResizablePanelLayout(
    persistentLayoutIdOf(autoSaveId, steps),
    steps.map((step) => panelIdOf(step.id)),
  );

  return (
    <SelectionWizardColumns
      steps={steps}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      {...columns}
    />
  );
};

export default SelectionWizardPersistentColumns;
