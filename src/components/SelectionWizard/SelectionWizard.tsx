/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { useState } from 'react';
import useKeyboardInset from '../../hooks/useKeyboardInset';
import useMediaQuery from '../../hooks/useMediaQuery';
import cn from '../../utils/cn';
import keyboardInsetStyle from '../../utils/keyboardInsetStyle';
import { Dialog, DialogContent, DialogTitle } from '../Dialog';
import { Sheet, SheetContent, SheetTitle } from '../Sheet';
import { DEFAULT_MOBILE_BREAKPOINT_QUERY } from '../SplitPane/splitPaneInternals';
import SelectionWizardColumns from './SelectionWizardColumns';
import SelectionWizardPersistentColumns from './SelectionWizardPersistentColumns';
import SelectionWizardFooter from './SelectionWizardFooter';
import SelectionWizardStepRail from './SelectionWizardStepRail';
import {
  resolveRenderedShell,
  resolveVisibleColumns,
  SELECTION_WIZARD_DEFAULT_MAX_COLUMNS,
  SELECTION_WIZARD_LAYOUTS,
  SELECTION_WIZARD_RENDERED_SHELLS,
  SELECTION_WIZARD_SHELLS,
  SELECTION_WIZARD_SUBMIT_ERROR_TAG,
  SELECTION_WIZARD_TEST_ID,
  showsStepsSideBySide,
  type SelectionWizardProps,
} from './selectionWizardInternals';

const DIALOG_CONTENT_CLASSES =
  'flex h-[min(720px,90vh)] w-[min(1100px,96vw)] max-w-none flex-col gap-0 overflow-hidden p-0';
const SHEET_CONTENT_CLASSES = 'flex h-[90dvh] flex-col gap-0 overflow-hidden rounded-t-lg p-0';

const SelectionWizard: React.FC<SelectionWizardProps> = ({
  title,
  steps,
  activeStepId,
  onActiveStepChange,
  labels,
  layout = SELECTION_WIZARD_LAYOUTS.COLUMNS,
  as = SELECTION_WIZARD_SHELLS.INLINE,
  isOpen = true,
  onClose,
  onCancel,
  onSubmit,
  autoSaveId,
  maxColumns = SELECTION_WIZARD_DEFAULT_MAX_COLUMNS,
  mobileBreakpointQuery = DEFAULT_MOBILE_BREAKPOINT_QUERY,
  className,
  'data-testid': testId = SELECTION_WIZARD_TEST_ID,
}) => {
  const isMobileView = useMediaQuery(mobileBreakpointQuery);
  const keyboardInset = useKeyboardInset();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSideBySide = showsStepsSideBySide(layout, isMobileView);
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const resolvedStepId = activeStep?.id ?? '';
  const visibleColumns = resolveVisibleColumns(steps, resolvedStepId, maxColumns);
  const renderedShell = resolveRenderedShell(as, isMobileView);
  const isDialog = renderedShell === SELECTION_WIZARD_RENDERED_SHELLS.DIALOG;
  const isSheet = renderedShell === SELECTION_WIZARD_RENDERED_SHELLS.SHEET;

  const closeOnDismiss = (open: boolean) => {
    if (!open) onClose?.();
  };

  const submit = async () => {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error(SELECTION_WIZARD_SUBMIT_ERROR_TAG, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBody = () => {
    if (!activeStep) return null;

    if (!isSideBySide) {
      return (
        <div
          key={activeStep.id}
          data-testid={`selection-wizard-column-${activeStep.id}`}
          data-active="true"
          className="flex h-full min-h-0 w-full flex-col"
        >
          {activeStep.render()}
        </div>
      );
    }

    if (autoSaveId) {
      return (
        <SelectionWizardPersistentColumns
          autoSaveId={autoSaveId}
          steps={visibleColumns}
          activeStepId={resolvedStepId}
          resizeHandleLabel={labels.resizeHandle}
        />
      );
    }

    return (
      <SelectionWizardColumns
        steps={visibleColumns}
        activeStepId={resolvedStepId}
        resizeHandleLabel={labels.resizeHandle}
      />
    );
  };

  const content = (
    <div
      data-testid={testId}
      data-layout={isSideBySide ? SELECTION_WIZARD_LAYOUTS.COLUMNS : SELECTION_WIZARD_LAYOUTS.STEPS}
      data-shell={renderedShell}
      className={cn('flex h-full min-h-0 w-full flex-col', className)}
    >
      <div className="flex flex-col gap-3 border-b border-accent-light px-4 py-3">
        {isDialog && <DialogTitle className="text-base font-semibold">{title}</DialogTitle>}
        {isSheet && <SheetTitle className="text-base font-semibold">{title}</SheetTitle>}
        {!isDialog && !isSheet && title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
        <SelectionWizardStepRail
          steps={steps}
          activeStepId={resolvedStepId}
          onActiveStepChange={onActiveStepChange}
          pickPlaceholder={labels.pickPlaceholder}
        />
      </div>
      <div className="flex min-h-0 flex-1">{renderBody()}</div>
      <SelectionWizardFooter
        steps={steps}
        activeStepId={resolvedStepId}
        labels={labels}
        onActiveStepChange={onActiveStepChange}
        showsNavigation={!isSideBySide}
        onCancel={onCancel}
        onSubmit={onSubmit ? submit : undefined}
        isSubmitting={isSubmitting}
      />
    </div>
  );

  if (isSheet) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={closeOnDismiss}
      >
        <SheetContent
          side="bottom"
          variant="primary"
          closeLabel={labels.close}
          aria-describedby={undefined}
          className={SHEET_CONTENT_CLASSES}
          style={keyboardInsetStyle(keyboardInset)}
        >
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  if (!isDialog) return content;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnDismiss}
    >
      <DialogContent
        variant="primary"
        closeLabel={labels.close}
        aria-describedby={undefined}
        className={DIALOG_CONTENT_CLASSES}
      >
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default SelectionWizard;
