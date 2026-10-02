/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SelectionWizard from './SelectionWizard';
import type { SelectionWizardLabels, SelectionWizardStep } from './selectionWizardInternals';

const mediaQueryMatches = vi.fn<[string], boolean>(() => false);
const keyboardInset = vi.fn(() => 0);
const useDefaultLayoutMock = vi.fn();

interface MockGroupProps {
  children?: React.ReactNode;
  className?: string;
  defaultLayout?: Record<string, number>;
  onLayoutChanged?: (layout: Record<string, number>) => void;
}

interface MockPanelProps {
  children?: React.ReactNode;
  id?: string;
  defaultSize?: number | string;
  minSize?: number | string;
}

interface MockSeparatorProps {
  children?: React.ReactNode;
  'aria-label'?: string;
}

vi.mock('../../hooks/useMediaQuery', () => ({
  default: (query: string) => mediaQueryMatches(query),
}));

vi.mock('../../hooks/useKeyboardInset', () => ({
  default: () => keyboardInset(),
}));

vi.mock('react-resizable-panels', () => ({
  Group: ({ children, className, defaultLayout, onLayoutChanged }: MockGroupProps) => (
    <div
      data-testid="rp-group"
      className={className}
      data-default-layout={defaultLayout ? JSON.stringify(defaultLayout) : undefined}
    >
      <button
        type="button"
        data-testid="rp-group-drag-to-half"
        onClick={() => onLayoutChanged?.(DRAGGED_LAYOUT)}
      />
      {children}
    </div>
  ),
  Panel: ({ children, id, defaultSize, minSize }: MockPanelProps) => (
    <div
      data-testid={`rp-panel-${id}`}
      data-default-size={defaultSize}
      data-min-size={minSize}
    >
      {children}
    </div>
  ),
  Separator: ({ children, 'aria-label': ariaLabel }: MockSeparatorProps) => (
    <div
      role="separator"
      aria-label={ariaLabel}
      data-testid="rp-separator"
    >
      {children}
    </div>
  ),
  useDefaultLayout: (args: { id: string; panelIds: string[] }) => useDefaultLayoutMock(args),
}));

const SAVED_LAYOUT = {
  'selection-wizard-step-a': 20,
  'selection-wizard-step-b': 50,
  'selection-wizard-step-c': 30,
};

const DRAGGED_LAYOUT = {
  'selection-wizard-step-a': 50,
  'selection-wizard-step-b': 25,
  'selection-wizard-step-c': 25,
};

const LABELS: SelectionWizardLabels = {
  back: 'Back',
  next: 'Next',
  submit: 'Finish',
  cancel: 'Cancel',
  close: 'Close',
  resizeHandle: 'Resize',
};

const step = (id: string, overrides: Partial<SelectionWizardStep> = {}): SelectionWizardStep => ({
  id,
  title: `Step ${id}`,
  render: () => <div data-testid={`body-${id}`}>{id}</div>,
  isComplete: false,
  ...overrides,
});

beforeEach(() => {
  mediaQueryMatches.mockReset();
  mediaQueryMatches.mockReturnValue(false);
  keyboardInset.mockReset();
  keyboardInset.mockReturnValue(0);
  useDefaultLayoutMock.mockReset();
  useDefaultLayoutMock.mockReturnValue({ defaultLayout: undefined, onLayoutChanged: undefined });
});

describe('SelectionWizard', () => {
  describe('columns layout on a wide screen', () => {
    it('renders every step side by side and marks the active column', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('body-a')).toBeInTheDocument();
      expect(screen.getByTestId('body-b')).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-layout', 'columns');
      expect(screen.getByTestId('selection-wizard-column-a')).toHaveAttribute('data-active', 'false');
      expect(screen.getByTestId('selection-wizard-column-b')).toHaveAttribute('data-active', 'true');
      expect(screen.getByRole('separator', { name: 'Resize' })).toBeInTheDocument();
    });

    it('offers no back or next button, since every step is already visible', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByTestId('selection-wizard-back')).toBeNull();
      expect(screen.queryByTestId('selection-wizard-next')).toBeNull();
    });

    it('splits the width as the steps ask and hands the panel ids to the layout store', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { defaultSize: 30 }), step('b'), step('c')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          autoSaveId="wizard-test"
        />,
      );

      expect(screen.getByTestId('rp-panel-selection-wizard-step-a')).toHaveAttribute('data-default-size', '30%');
      expect(screen.getByTestId('rp-panel-selection-wizard-step-b')).toHaveAttribute('data-default-size', '35%');
      expect(useDefaultLayoutMock).toHaveBeenCalledWith({
        id: 'wizard-test:a-b-c',
        panelIds: ['selection-wizard-step-a', 'selection-wizard-step-b', 'selection-wizard-step-c'],
      });
    });

    it('restores the widths the layout store saved and hands it every width the user drags', () => {
      const saveLayout = vi.fn();
      useDefaultLayoutMock.mockReturnValue({ defaultLayout: SAVED_LAYOUT, onLayoutChanged: saveLayout });

      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a'), step('b'), step('c')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          autoSaveId="wizard-test"
        />,
      );
      fireEvent.click(screen.getByTestId('rp-group-drag-to-half'));

      expect(screen.getByTestId('rp-group')).toHaveAttribute('data-default-layout', JSON.stringify(SAVED_LAYOUT));
      expect(saveLayout).toHaveBeenCalledWith(DRAGGED_LAYOUT);
    });

    it('neither restores nor saves widths without an autoSaveId', () => {
      useDefaultLayoutMock.mockReturnValue({ defaultLayout: SAVED_LAYOUT, onLayoutChanged: vi.fn() });

      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a'), step('b'), step('c')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(useDefaultLayoutMock).not.toHaveBeenCalled();
      expect(screen.getByTestId('rp-group')).not.toHaveAttribute('data-default-layout');
    });

    it('slides a window of three columns along with the active step when there are more steps', () => {
      const steps = [
        step('a', { isComplete: true }),
        step('b', { isComplete: true }),
        step('c', { isComplete: true }),
        step('d', { isComplete: true }),
        step('e'),
      ];
      const { rerender } = render(
        <SelectionWizard
          title="Pick"
          steps={steps}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-layout', 'columns');
      expect(screen.getByTestId('body-a')).toBeInTheDocument();
      expect(screen.getByTestId('body-c')).toBeInTheDocument();
      expect(screen.queryByTestId('body-d')).toBeNull();
      expect(screen.getAllByTestId(/^selection-wizard-step-[a-e]$/)).toHaveLength(5);

      rerender(
        <SelectionWizard
          title="Pick"
          steps={steps}
          activeStepId="e"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByTestId('body-a')).toBeNull();
      expect(screen.getByTestId('body-c')).toBeInTheDocument();
      expect(screen.getByTestId('body-e')).toBeInTheDocument();
    });

    it('lets the caller widen or narrow the window', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a'), step('b'), step('c'), step('d')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          maxColumns={4}
        />,
      );

      expect(screen.getByTestId('body-d')).toBeInTheDocument();
    });
  });

  describe('one step at a time', () => {
    it('shows only the active step on a narrow screen', () => {
      mediaQueryMatches.mockReturnValue(true);
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByTestId('body-a')).toBeNull();
      expect(screen.getByTestId('body-b')).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-layout', 'steps');
    });

    it('starts every step fresh on a narrow screen, so a search typed in one step does not filter the next', () => {
      mediaQueryMatches.mockReturnValue(true);
      const SearchField = () => {
        const [query, setQuery] = React.useState('');
        return (
          <input
            data-testid="step-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        );
      };
      const searchableSteps = [
        step('a', { isComplete: true, render: () => <SearchField /> }),
        step('b', { render: () => <SearchField /> }),
      ];
      const { rerender } = render(
        <SelectionWizard
          title="Pick"
          steps={searchableSteps}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      fireEvent.change(screen.getByTestId('step-search'), { target: { value: '7a' } });
      rerender(
        <SelectionWizard
          title="Pick"
          steps={searchableSteps}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('step-search')).toHaveValue('');
    });

    it('keeps next locked until the active step is complete, then moves on', () => {
      const onActiveStepChange = vi.fn();
      const { rerender } = render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a'), step('b')]}
          activeStepId="a"
          onActiveStepChange={onActiveStepChange}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-next')).toBeDisabled();
      expect(screen.queryByTestId('selection-wizard-back')).toBeNull();

      rerender(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="a"
          onActiveStepChange={onActiveStepChange}
          labels={LABELS}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-next'));
      expect(onActiveStepChange).toHaveBeenCalledWith('b');
    });

    it('lets an optional step be skipped with next', () => {
      const onActiveStepChange = vi.fn();
      render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isOptional: true }), step('b')]}
          activeStepId="a"
          onActiveStepChange={onActiveStepChange}
          labels={LABELS}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-next'));
      expect(onActiveStepChange).toHaveBeenCalledWith('b');
    });

    it('goes back to the previous step', () => {
      const onActiveStepChange = vi.fn();
      render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={onActiveStepChange}
          labels={LABELS}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-back'));
      expect(onActiveStepChange).toHaveBeenCalledWith('a');
    });

    it('shows submit only on the last step', () => {
      const { rerender } = render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.queryByTestId('selection-wizard-submit')).toBeNull();

      rerender(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByTestId('selection-wizard-submit')).toBeInTheDocument();
    });
  });

  describe('step rail', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('scrolls the step that becomes active into view, so a rail wider than the screen never hides it', () => {
      const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
      const steps = [step('a', { isComplete: true }), step('b', { isComplete: true }), step('c')];
      const { rerender } = render(
        <SelectionWizard
          steps={steps}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );
      scrollIntoView.mockClear();

      rerender(
        <SelectionWizard
          steps={steps}
          activeStepId="c"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByTestId('selection-wizard-step-c'));
      expect(scrollIntoView).toHaveBeenCalledWith({ inline: 'nearest', block: 'nearest' });
    });
  });

  describe('title', () => {
    it('shows only the step rail when an inline wizard is given no title, since the page around it already has one', () => {
      render(
        <SelectionWizard
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByRole('heading')).toBeNull();
      expect(screen.getByTestId('selection-wizard-step-rail')).toBeInTheDocument();
    });
  });

  describe('step rail', () => {
    it('jumps back to a passed step and refuses a locked one', () => {
      const onActiveStepChange = vi.fn();
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b'), step('c')]}
          activeStepId="b"
          onActiveStepChange={onActiveStepChange}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-step-a')).toHaveAttribute('data-state', 'done');
      expect(screen.getByTestId('selection-wizard-step-b')).toHaveAttribute('aria-current', 'step');
      expect(screen.getByTestId('selection-wizard-step-c')).toBeDisabled();

      fireEvent.click(screen.getByTestId('selection-wizard-step-a'));
      expect(onActiveStepChange).toHaveBeenCalledWith('a');

      fireEvent.click(screen.getByTestId('selection-wizard-step-c'));
      expect(onActiveStepChange).toHaveBeenCalledTimes(1);
    });

    it('marks a finished step with the icon of what it picked, instead of a check mark', () => {
      render(
        <SelectionWizard
          steps={[
            step('a', { isComplete: true, pickIcon: <span data-testid="pick-icon-a" /> }),
            step('b', { isComplete: true }),
            step('c'),
          ]}
          activeStepId="c"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('pick-icon-a')).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard-step-b').querySelector('svg')).not.toBeNull();
      expect(screen.getByTestId('selection-wizard-step-c')).toHaveTextContent('3');
    });

    it('shows what a step picked under its title', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true, pickLabel: '14a' }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-pick-a')).toHaveTextContent('14a');
    });

    it('reserves the pick line under every title, so the rail keeps its height when a pick arrives', () => {
      render(
        <SelectionWizard
          steps={[step('a', { isComplete: true, pickLabel: '14a' }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={{ ...LABELS, pickPlaceholder: 'Select' }}
        />,
      );

      expect(screen.getByTestId('selection-wizard-pick-a')).toHaveTextContent('14a');
      expect(screen.getByTestId('selection-wizard-pick-b')).toHaveTextContent('Select');
      expect(screen.getByTestId('selection-wizard-pick-b')).toHaveAttribute('data-placeholder', 'true');
    });

    it('keeps the pick line even without a placeholder label, so a late pick still does not shift the body', () => {
      render(
        <SelectionWizard
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-pick-a')).toBeInTheDocument();
    });

    it('keeps every step titled on a narrow screen too, where only one of them renders its body', () => {
      mediaQueryMatches.mockReturnValue(true);
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b'), step('c')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-step-a')).toHaveTextContent('Step a');
      expect(screen.getByTestId('selection-wizard-step-b')).toHaveTextContent('Step b');
      expect(screen.getByTestId('selection-wizard-step-c')).toHaveTextContent('Step c');
      expect(screen.getByTestId('body-b')).toBeInTheDocument();
      expect(screen.queryByTestId('body-a')).toBeNull();
    });
  });

  describe('an active step id that names no step', () => {
    it('shows the first step one step at a time, with the rail and the footer on that step too', () => {
      render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="gone"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByTestId('body-a')).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard-step-a')).toHaveAttribute('aria-current', 'step');
      expect(screen.getByTestId('selection-wizard-next')).toBeInTheDocument();
      expect(screen.queryByTestId('selection-wizard-submit')).toBeNull();
    });

    it('marks the first column active side by side', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="gone"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard-column-a')).toHaveAttribute('data-active', 'true');
      expect(screen.getByTestId('selection-wizard-column-b')).toHaveAttribute('data-active', 'false');
    });
  });

  describe('footer', () => {
    it('renders the active step’s secondary action and fires it', () => {
      const onSelect = vi.fn();
      render(
        <SelectionWizard
          title="Pick"
          steps={[
            step('a', { isComplete: true }),
            step('b', { secondaryAction: { label: 'Without a room', onSelect } }),
          ]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-secondary-action'));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('renders nothing at all when there is nothing to put in it', () => {
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByTestId('selection-wizard-footer')).toBeNull();
    });

    it('keeps submit locked until every required step is complete, then awaits it', async () => {
      let release: () => void = () => undefined;
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            release = resolve;
          }),
      );
      const { rerender } = render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={onSubmit}
        />,
      );

      expect(screen.getByTestId('selection-wizard-submit')).toBeDisabled();

      rerender(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true }), step('b', { isComplete: true })]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-submit'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.getByTestId('selection-wizard-submit')).toBeDisabled());

      release();
      await waitFor(() => expect(screen.getByTestId('selection-wizard-submit')).toBeEnabled());
    });

    it('logs a rejected submit instead of letting it escape, and unlocks the button again', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const onSubmit = vi.fn().mockRejectedValue(new Error('nope'));
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a', { isComplete: true })]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onSubmit={onSubmit}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-submit'));

      await waitFor(() =>
        expect(consoleError).toHaveBeenCalledWith('SelectionWizard: onSubmit rejected', expect.any(Error)),
      );
      await waitFor(() => expect(screen.getByTestId('selection-wizard-submit')).toBeEnabled());
      consoleError.mockRestore();
    });

    it('fires cancel', () => {
      const onCancel = vi.fn();
      render(
        <SelectionWizard
          title="Pick"
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onCancel={onCancel}
        />,
      );

      fireEvent.click(screen.getByTestId('selection-wizard-cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('draws cancel as the same outlined button as back, the way every dialog footer does', () => {
      render(
        <SelectionWizard
          title="Pick"
          layout="steps"
          steps={[step('a', { isComplete: true }), step('b')]}
          activeStepId="b"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByTestId('selection-wizard-cancel').className).toBe(
        screen.getByTestId('selection-wizard-back').className,
      );
      expect(screen.getByTestId('selection-wizard-cancel').parentElement).toHaveClass('gap-4');
    });
  });

  describe('dialog shell', () => {
    it('wraps the wizard in a dialog with the title and reports the close', () => {
      const onClose = vi.fn();
      render(
        <SelectionWizard
          as="dialog"
          isOpen
          onClose={onClose}
          title="Hand out files"
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByRole('dialog', { name: 'Hand out files' })).toBeInTheDocument();
      expect(screen.getByTestId('body-a')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders nothing while closed', () => {
      render(
        <SelectionWizard
          as="dialog"
          isOpen={false}
          onClose={vi.fn()}
          title="Hand out files"
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.queryByTestId('body-a')).toBeNull();
    });
  });

  describe('adaptive shell', () => {
    const renderAdaptive = (onClose = vi.fn(), isOpen = true) =>
      render(
        <SelectionWizard
          as="adaptive"
          isOpen={isOpen}
          onClose={onClose}
          title="Start session"
          steps={[step('a'), step('b')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

    it('is the same centred dialog as the dialog shell on a wide screen', () => {
      renderAdaptive();

      expect(screen.getByRole('dialog', { name: 'Start session' })).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-shell', 'dialog');
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-layout', 'columns');
    });

    it('slides up as a sheet on a narrow screen, one step at a time', () => {
      mediaQueryMatches.mockReturnValue(true);

      renderAdaptive();

      expect(screen.getByRole('dialog', { name: 'Start session' })).toBeInTheDocument();
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-shell', 'sheet');
      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-layout', 'steps');
      expect(screen.getByTestId('body-a')).toBeInTheDocument();
      expect(screen.queryByTestId('body-b')).toBeNull();
    });

    it('rounds the top corners of the sheet like every other dialog', () => {
      mediaQueryMatches.mockReturnValue(true);

      renderAdaptive();

      expect(screen.getByRole('dialog', { name: 'Start session' })).toHaveClass('rounded-t-lg');
      expect(screen.getByRole('dialog', { name: 'Start session' })).not.toHaveClass('rounded-t-xl');
    });

    it('moves the sheet above the on-screen keyboard, so Start stays in reach while a search field has focus', () => {
      mediaQueryMatches.mockReturnValue(true);
      keyboardInset.mockReturnValue(320);

      renderAdaptive();

      const sheet = screen.getByRole('dialog', { name: 'Start session' });
      expect(sheet.style.bottom).toBe('320px');
      expect(sheet.style.maxHeight).toBe('calc(100vh - 320px)');
    });

    it('keeps the sheet on the bottom edge while no keyboard is open', () => {
      mediaQueryMatches.mockReturnValue(true);
      keyboardInset.mockReturnValue(0);

      renderAdaptive();

      const sheet = screen.getByRole('dialog', { name: 'Start session' });
      expect(sheet.style.bottom).toBe('');
      expect(sheet.style.maxHeight).toBe('');
    });

    it('reports the close of the sheet', () => {
      mediaQueryMatches.mockReturnValue(true);
      const onClose = vi.fn();

      renderAdaptive(onClose);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders nothing while closed, on a narrow screen too', () => {
      mediaQueryMatches.mockReturnValue(true);

      renderAdaptive(vi.fn(), false);

      expect(screen.queryByTestId('body-a')).toBeNull();
    });

    it('leaves the dialog shell a dialog on a narrow screen, so only callers that ask for it get a sheet', () => {
      mediaQueryMatches.mockReturnValue(true);

      render(
        <SelectionWizard
          as="dialog"
          isOpen
          onClose={vi.fn()}
          title="Hand out files"
          steps={[step('a')]}
          activeStepId="a"
          onActiveStepChange={vi.fn()}
          labels={LABELS}
        />,
      );

      expect(screen.getByTestId('selection-wizard')).toHaveAttribute('data-shell', 'dialog');
    });
  });
});
