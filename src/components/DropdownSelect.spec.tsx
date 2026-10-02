/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownSelect from './DropdownSelect';
import type { DropdownOptions } from './DropdownSelect';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './DropdownMenu';

const TWO_OPTIONS: DropdownOptions[] = [
  { id: 'opt-1', name: 'Option A' },
  { id: 'opt-2', name: 'Option B' },
];

const FIVE_OPTIONS: DropdownOptions[] = [
  { id: 'opt-1', name: 'Alpha' },
  { id: 'opt-2', name: 'Beta' },
  { id: 'opt-3', name: 'Gamma' },
  { id: 'opt-4', name: 'Delta' },
  { id: 'opt-5', name: 'Epsilon' },
];

const defaultProps = () => ({
  options: TWO_OPTIONS,
  selectedVal: 'opt-1',
  handleChange: vi.fn(),
});

const GROUPED_OPTIONS: DropdownOptions[] = [
  { id: 'l1', name: 'A 01 · Reihen' },
  { id: 'l2', name: 'A 01 · Sitzkreis' },
  { id: 'l3', name: 'Aula · Sitzkreis' },
];

const groupOfRoom = (option: DropdownOptions) => option.name.split(' · ')[0];

describe('DropdownSelect', () => {
  let onDocumentEscape: ReturnType<typeof vi.fn>;

  describe('grouped options', () => {
    const openGrouped = (props = {}) => {
      render(
        <DropdownSelect
          options={GROUPED_OPTIONS}
          selectedVal=""
          handleChange={vi.fn()}
          groupOf={groupOfRoom}
          searchFromOptionCount={1}
          placeholder="Raum wählen"
          {...props}
        />,
      );
      fireEvent.click(screen.getByPlaceholderText('Raum wählen'));
    };

    it('writes a heading above the first option of each group and not above its siblings', () => {
      openGrouped();

      expect(screen.getAllByText('A 01')).toHaveLength(1);
      expect(screen.getAllByText('Aula')).toHaveLength(1);
    });

    it('keeps the heading over a filtered list, so a search never leaves options without their group', async () => {
      openGrouped();

      await userEvent.type(screen.getByPlaceholderText('Raum wählen'), 'Sitzkreis');

      expect(screen.getAllByText('A 01')).toHaveLength(1);
      expect(screen.getAllByText('Aula')).toHaveLength(1);
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('names the option with its room, even while the row draws only the layout', () => {
      openGrouped({
        renderOption: (option: DropdownOptions) => <span>{option.name.split(' · ')[1]}</span>,
      });

      expect(screen.getByRole('option', { name: 'A 01 · Sitzkreis' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Aula · Sitzkreis' })).toBeInTheDocument();
    });

    it('ties the heading to the options standing under it, so a screen reader reads them as one room', () => {
      openGrouped();

      const firstRoom = screen.getByRole('group', { name: 'A 01' });

      expect(within(firstRoom).getAllByRole('option')).toHaveLength(2);
      expect(within(screen.getByRole('group', { name: 'Aula' })).getAllByRole('option')).toHaveLength(1);
    });

    it('names a group even when the id of its first option carries a space', () => {
      openGrouped({
        options: [
          { id: 'elsewhere:Test Variante', name: 'A 01 · Reihen' },
          { id: 'elsewhere:Other Variante', name: 'Aula · Sitzkreis' },
        ],
      });

      expect(within(screen.getByRole('group', { name: 'A 01' })).getAllByRole('option')).toHaveLength(1);
      expect(within(screen.getByRole('group', { name: 'Aula' })).getAllByRole('option')).toHaveLength(1);
    });

    it('leaves the heading out of the options, so it can neither be picked nor tabbed to', async () => {
      const handleChange = vi.fn();
      openGrouped({ handleChange });

      const heading = screen.getAllByText('A 01')[0];
      expect(heading).toHaveAttribute('role', 'presentation');
      expect(heading).not.toHaveAttribute('tabindex');
      expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
        'A 01 · Reihen',
        'A 01 · Sitzkreis',
        'Aula · Sitzkreis',
      ]);

      await userEvent.click(heading);

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('writes no heading for an option the caller names no group for, instead of an empty one', () => {
      openGrouped({
        options: [
          { id: 'l1', name: 'A 01 · Reihen' },
          { id: 'o', name: 'Reihen' },
        ],
        groupOf: (option: DropdownOptions) => (option.id === 'o' ? '' : groupOfRoom(option)),
      });

      const headings = screen.getAllByRole('presentation');

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('A 01');
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('heads a room once while the user searches, and leaves no heading for a room with no hit', async () => {
      openGrouped({
        options: [
          { id: 'l1', name: 'A 01 · Reihen' },
          { id: 'l2', name: 'Aula · Reihen' },
          { id: 'l3', name: 'Aula · Sitzkreis' },
        ],
      });

      await userEvent.type(screen.getByPlaceholderText('Raum wählen'), 'Aula');

      expect(screen.getAllByText('Aula')).toHaveLength(1);
      expect(screen.queryByText('A 01')).toBeNull();
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('writes no heading at all while the caller names no group', () => {
      render(
        <DropdownSelect
          options={GROUPED_OPTIONS}
          selectedVal=""
          handleChange={vi.fn()}
          searchFromOptionCount={1}
          placeholder="Raum wählen"
        />,
      );
      fireEvent.click(screen.getByPlaceholderText('Raum wählen'));

      expect(screen.queryByRole('presentation')).toBeNull();
    });
  });

  it('offers the search field from the option count the caller asks for, not only from four', () => {
    render(
      <DropdownSelect
        options={[{ id: 'a', name: 'Raum A' }]}
        selectedVal=""
        handleChange={vi.fn()}
        searchFromOptionCount={1}
        placeholder="Raum wählen"
      />,
    );

    expect(screen.getByPlaceholderText('Raum wählen')).not.toHaveAttribute('readonly');
  });

  it('keeps a short list read-only while the caller leaves the threshold alone', () => {
    render(
      <DropdownSelect
        options={[{ id: 'a', name: 'Raum A' }]}
        selectedVal=""
        handleChange={vi.fn()}
        placeholder="Raum wählen"
      />,
    );

    expect(document.querySelector('input')).toHaveAttribute('readonly');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    onDocumentEscape = vi.fn();
    document.addEventListener('keydown', onDocumentEscape, { capture: true });
  });

  afterEach(() => {
    document.removeEventListener('keydown', onDocumentEscape, { capture: true });
  });

  it('renders with selected value displayed', () => {
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input.value).toBe('Option A');
  });

  it('shows placeholder when no value is selected', () => {
    const props = { ...defaultProps(), selectedVal: '', placeholder: 'Select an option' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input.value).toBe('Select an option');
  });

  it('opens menu on click showing all options', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Option A');
    expect(options[1]).toHaveTextContent('Option B');
  });

  it('uses the contrast-safe glass panel for the option list', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(listbox.className).toContain('liquid-glass-panel');
    expect(listbox.className).toContain('text-foreground');
    expect(listbox.className).not.toContain('liquid-glass-soft');
  });

  it('calls handleChange when an option is selected', async () => {
    const user = userEvent.setup();
    const props = defaultProps();
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    const optionB = within(listbox).getByText('Option B');
    await user.click(optionB);
    expect(props.handleChange).toHaveBeenCalledWith('opt-2');
  });

  it('closes menu after selecting an option', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByText('Option B'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not call handleChange on disabled option click', async () => {
    const user = userEvent.setup();
    const options: DropdownOptions[] = [
      { id: 'opt-1', name: 'Enabled' },
      { id: 'opt-2', name: 'Disabled', disabled: true },
    ];
    const props = { ...defaultProps(), options };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const disabledOption = screen.getByText('Disabled');
    await user.click(disabledOption);
    expect(props.handleChange).not.toHaveBeenCalled();
  });

  it('marks disabled option with aria-disabled', async () => {
    const user = userEvent.setup();
    const options: DropdownOptions[] = [
      { id: 'opt-1', name: 'Enabled' },
      { id: 'opt-2', name: 'Disabled', disabled: true },
    ];
    render(
      <DropdownSelect
        {...defaultProps()}
        options={options}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const disabledOption = screen.getByText('Disabled').closest('[role="option"]');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows search input when more than 3 options', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input.type).toBe('text');
    await user.click(input);
    await user.type(input, 'Gam');
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Gamma');
  });

  it('shows no-results message when search finds nothing', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1', noResultsText: 'No results' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    await user.type(input, 'zzzzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('marks selected option with aria-selected', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    const selected = within(listbox).getByRole('option', { selected: true });
    expect(selected).toHaveTextContent('Option A');
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <DropdownSelect {...defaultProps()} />
      </div>,
    );
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on a bare pointerdown outside without a compatibility mousedown (pen input)', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside</button>
        <DropdownSelect {...defaultProps()} />
      </div>,
    );
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.pointerDown(screen.getByText('Outside'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('disables input when options array is empty', () => {
    const props = { ...defaultProps(), options: [] };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input).toBeDisabled();
  });

  it('uses renderLabel to transform option names', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps(),
      renderLabel: (name: string) => `[${name}]`,
    };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input.value).toBe('[Option A]');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('[Option A]')).toBeInTheDocument();
    expect(within(listbox).getByText('[Option B]')).toBeInTheDocument();
  });

  it('lets renderOption put arbitrary content in an option row, such as an icon beside the name', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps(),
      renderOption: (option, label) => (
        <span>
          <span data-testid={`icon-${option.id}`} />
          {label}
        </span>
      ),
    };
    render(<DropdownSelect {...props} />);
    await user.click(screen.getByRole('combobox').querySelector('input'));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByTestId('icon-opt-1')).toBeInTheDocument();
    expect(within(listbox).getByText('Option A')).toBeInTheDocument();
  });

  it('keeps renderLabel in charge of the trigger while renderOption only shapes the rows', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps(),
      renderLabel: (name) => `[${name}]`,
      renderOption: (option, label) => <span data-testid={`row-${option.id}`}>{label}</span>,
    };
    render(<DropdownSelect {...props} />);
    expect(screen.getByRole('combobox').querySelector('input').value).toBe('[Option A]');
    await user.click(screen.getByRole('combobox').querySelector('input'));
    expect(within(screen.getByRole('listbox')).getByTestId('row-opt-1')).toHaveTextContent('[Option A]');
  });

  it('filters on the renderLabel text while renderOption shapes the rows', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps(),
      options: FIVE_OPTIONS,
      selectedVal: 'opt-1',
      renderLabel: (name: string) => `[${name}]`,
      renderOption: (option, label) => <span data-testid={`row-${option.id}`}>{label}</span>,
    };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    await user.click(input);
    await user.type(input, '[[Gam');

    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByTestId('row-opt-3')).toHaveTextContent('[Gamma]');
    expect(within(listbox).queryByTestId('row-opt-1')).not.toBeInTheDocument();
    expect(within(listbox).queryByTestId('row-opt-2')).not.toBeInTheDocument();
  });

  it('suppresses the search input when enableSearch=false even with more than 3 options', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps(),
      options: FIVE_OPTIONS,
      selectedVal: 'opt-1',
      enableSearch: false,
    };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input).toHaveAttribute('readonly');
    expect(input.value).toBe('Alpha');
    await user.click(input);
    await user.type(input, 'Gam');
    expect(input.value).toBe('Alpha');
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getAllByRole('option')).toHaveLength(5);
  });

  it('renders the listbox in document.body when enablePortalUsage is the default', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const combobox = screen.getByRole('combobox');
    const input = combobox.querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(combobox.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it('renders the listbox inline next to the trigger when enablePortalUsage=false', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), enablePortalUsage: false };
    render(<DropdownSelect {...props} />);
    const combobox = screen.getByRole('combobox');
    const input = combobox.querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    expect(combobox.contains(listbox)).toBe(true);
    expect(listbox.className).toContain('absolute');
    expect(listbox.className).not.toContain('fixed');
  });

  it('points combobox and input aria-controls at the rendered listbox id', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const combobox = screen.getByRole('combobox');
    const input = combobox.querySelector('input');
    await user.click(input);
    const listbox = screen.getByRole('listbox');
    const listboxId = listbox.getAttribute('id');
    expect(listboxId).toBeTruthy();
    expect(combobox).toHaveAttribute('aria-controls', listboxId);
    expect(input).toHaveAttribute('aria-controls', listboxId);
  });

  it('does not open the menu on programmatic focus (e.g. parent autofocus)', () => {
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');
    input.focus();
    expect(input).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not open the menu when the input is reached via keyboard tab', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(
      <>
        <button type="button">Before</button>
        <DropdownSelect {...props} />
      </>,
    );
    await user.tab();
    await user.tab();
    const input = screen.getByRole('combobox').querySelector('input');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape from the search field and keeps the typed query from lingering', async () => {
    const user = userEvent.setup();
    render(
      <DropdownSelect
        options={FIVE_OPTIONS}
        selectedVal="opt-1"
        handleChange={vi.fn()}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    await user.click(input);
    await user.type(input, 'Gam');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('closes on Escape from an option and hands the focus back to the field', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <DropdownSelect
        {...defaultProps()}
        handleChange={handleChange}
      />,
    );
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    await user.click(input);
    screen.getByRole('option', { name: 'Option B' }).focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveFocus();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('closes only its open menu on Escape inside a dialog, and leaves the next Escape to the dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogTitle>Plan</DialogTitle>
          <DialogDescription>Plan</DialogDescription>
          <DropdownSelect {...defaultProps()} />
        </DialogContent>
      </Dialog>,
    );
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    await user.click(input);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes its own list once the focus moves to a menu next to it, and leaves that menu its Escape', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DropdownSelect {...defaultProps()} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button">Plan actions</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>,
    );
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    await user.click(input);
    screen.getByRole('button', { name: 'Plan actions' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.queryByRole('listbox', { hidden: true })).not.toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByRole('listbox', { hidden: true })).not.toBeInTheDocument();
    expect(input).not.toHaveFocus();
  });

  it('closes the list on Escape without taking the focus when the focus sits outside the field and the list', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    await user.click(input);
    act(() => input.blur());
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).not.toHaveFocus();
  });

  it('lets an Escape pass through while the menu is closed, so a surrounding dialog can still close', () => {
    const onParentKeyDown = vi.fn();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={onParentKeyDown}>
        <DropdownSelect {...defaultProps()} />
      </div>,
    );
    const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onParentKeyDown).toHaveBeenCalledTimes(1);
  });

  it('generates a unique listbox id per instance', () => {
    render(
      <>
        <DropdownSelect {...defaultProps()} />
        <DropdownSelect {...defaultProps()} />
      </>,
    );
    const [firstCombobox, secondCombobox] = screen.getAllByRole('combobox');
    const firstId = firstCombobox.getAttribute('aria-controls');
    const secondId = secondCombobox.getAttribute('aria-controls');
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it('closes only the option list on Escape and keeps the event from reaching a surrounding dialog', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onDocumentEscape).not.toHaveBeenCalled();
  });

  it('lets Escape through once the option list is closed', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.keyboard('{Escape}');
    await user.keyboard('{Escape}');

    expect(onDocumentEscape).toHaveBeenCalledTimes(1);
  });

  it('restores the selected option in the trigger when Escape abandons a typed search filter', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.type(input, 'Gam');
    expect(input.value).toBe('Gam');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('Alpha');
  });

  it('restores the selected option in the trigger when a click outside abandons a typed search filter', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(
      <div>
        <button type="button">Outside</button>
        <DropdownSelect {...props} />
      </div>,
    );
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.type(input, 'Gam');
    await user.click(screen.getByText('Outside'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('Alpha');
  });

  it('keeps the search filter out of the way of the next selection made after an abandoned one', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1', handleChange };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.type(input, 'Gam');
    await user.keyboard('{Escape}');

    expect(input.value).toBe('');

    await user.click(input);

    expect(within(screen.getByRole('listbox')).getAllByRole('option')).toHaveLength(FIVE_OPTIONS.length);
    await user.click(screen.getByText('Delta'));
    expect(handleChange).toHaveBeenCalledWith('opt-4');
  });

  it('reopens the option list when the still-focused search filter is typed into after Escape', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveFocus();

    await user.keyboard('Gam');

    expect(input.value).toBe('Gam');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    const filtered = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toHaveTextContent('Gamma');
  });

  it('closes its option list when focus moves on to another dropdown', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(
      <>
        <DropdownSelect
          {...props}
          ariaLabel="First"
        />
        <DropdownSelect
          {...props}
          ariaLabel="Second"
        />
      </>,
    );
    const firstInput = screen.getByLabelText('First');
    const [firstCombobox] = screen.getAllByRole('combobox');

    await user.click(firstInput);
    await user.type(firstInput, 'Gam');
    await user.tab();

    expect(screen.getByLabelText('Second')).toHaveFocus();
    expect(firstCombobox).toHaveAttribute('aria-expanded', 'false');
    expect(firstInput).toHaveValue('');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps the option list open when a click lands on a non-focusable part of it', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1', noResultsText: 'No results' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.type(input, 'zzz');

    await user.click(screen.getByText('No results'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveValue('zzz');
  });

  it('keeps the option list open when focus moves from an option back to the search filter', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1', enablePortalUsage: false };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.tab();

    expect(within(screen.getByRole('listbox')).getAllByRole('option')[0]).toHaveFocus();

    await user.tab({ shift: true });

    expect(input).toHaveFocus();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('keeps a typed search filter when the field is clicked while the option list is open', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(<DropdownSelect {...props} />);
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    await user.type(input, 'Gam');
    await user.click(input);

    expect(input).toHaveValue('Gam');
    const filtered = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toHaveTextContent('Gamma');
  });

  it('closes the option list of the dropdown being typed into on the first Escape', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps(), options: FIVE_OPTIONS, selectedVal: 'opt-1' };
    render(
      <>
        <DropdownSelect
          {...props}
          ariaLabel="First"
        />
        <DropdownSelect
          {...props}
          ariaLabel="Second"
        />
      </>,
    );
    const [, secondCombobox] = screen.getAllByRole('combobox');

    await user.click(screen.getByLabelText('First'));
    await user.keyboard('Gam');
    await user.tab();
    await user.keyboard('Gam');

    expect(screen.getByLabelText('Second')).toHaveFocus();

    expect(screen.getAllByRole('listbox')).toHaveLength(1);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(secondCombobox).toHaveAttribute('aria-expanded', 'false');
    expect(onDocumentEscape.mock.calls.some(([event]) => event.key === 'Escape')).toBe(false);
  });

  it('keeps the surrounding dialog open on the first Escape and closes it on the second', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        onOpenChange={onOpenChange}
      >
        <DialogContent>
          <DialogTitle>Command</DialogTitle>
          <input
            type="text"
            aria-label="Comment"
          />
          <DropdownSelect {...defaultProps()} />
        </DialogContent>
      </Dialog>,
    );
    const comment = screen.getByLabelText('Comment');
    await user.type(comment, 'do not lose me');
    const input = screen.getByRole('combobox').querySelector('input');

    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Comment')).toHaveValue('do not lose me');

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('limits the option list to three and a half option rows', async () => {
    const user = userEvent.setup();
    render(<DropdownSelect {...defaultProps()} />);
    await user.click(screen.getByRole('combobox').querySelector('input'));
    expect(screen.getByRole('listbox')).toHaveStyle({ maxHeight: '134.75px' });
  });

  it('lets maxMenuHeight override the default option list height', async () => {
    const user = userEvent.setup();
    render(
      <DropdownSelect
        {...defaultProps()}
        maxMenuHeight={200}
      />,
    );
    await user.click(screen.getByRole('combobox').querySelector('input'));
    expect(screen.getByRole('listbox')).toHaveStyle({ maxHeight: '200px' });
  });

  describe('pressing Escape', () => {
    const renderInDialog = (onOpenChange: (open: boolean) => void) =>
      render(
        <Dialog
          open
          onOpenChange={onOpenChange}
        >
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
            <DropdownSelect {...defaultProps()} />
          </DialogContent>
        </Dialog>,
      );

    it('closes the open menu', async () => {
      const user = userEvent.setup();
      render(<DropdownSelect {...defaultProps()} />);
      await user.click(screen.getByRole('combobox').querySelector('input'));

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes only the open menu, not the dialog around it', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderInDialog(onOpenChange);
      await user.click(screen.getByRole('combobox').querySelector('input'));

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('leaves Escape to the dialog while the menu is closed', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderInDialog(onOpenChange);
      await user.click(screen.getByRole('combobox').querySelector('input'));
      await user.keyboard('{Escape}');

      await user.keyboard('{Escape}');

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('focusing the trigger the way a dialog does, which selects its content', () => {
    const focusAndSelect = async (input: HTMLInputElement) => {
      act(() => {
        input.focus();
        input.select();
      });
      await act(async () => {
        await Promise.resolve();
      });
    };

    it('leaves no placeholder text selected on the read-only trigger', async () => {
      render(
        <DropdownSelect
          {...defaultProps()}
          selectedVal=""
          placeholder="Raum wählen"
        />,
      );
      const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

      await focusAndSelect(input);

      expect(input).toHaveFocus();
      expect(input.value).toBe('Raum wählen');
      expect(input.selectionStart).toBe(input.selectionEnd);
    });

    it('leaves no selected label text selected on the read-only trigger', async () => {
      render(<DropdownSelect {...defaultProps()} />);
      const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;

      await focusAndSelect(input);

      expect(input.selectionStart).toBe(input.selectionEnd);
      expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('keeps the selection of a searchable trigger, where it is the query being typed', () => {
      render(
        <DropdownSelect
          {...defaultProps()}
          options={FIVE_OPTIONS}
        />,
      );
      const input = screen.getByRole('combobox').querySelector('input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Al' } });

      act(() => {
        input.focus();
        input.select();
      });

      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(2);
    });
  });
});
