/*
 * Copyright (C) [2025] [Netzint GmbH]
 * All rights reserved.
 *
 * This software is dual-licensed under the terms of:
 *
 * 1. The GNU Affero General Public License (AGPL-3.0-or-later), as published by the Free Software Foundation.
 *    You may use, modify and distribute this software under the terms of the AGPL, provided that you comply with its conditions.
 *
 *    A copy of the license can be found at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * OR
 *
 * 2. A commercial license agreement with Netzint GmbH. Licensees holding a valid commercial license from Netzint GmbH
 *    may use this software in accordance with the terms contained in such written agreement, without the obligations imposed by the AGPL.
 *
 * If you are uncertain which license applies to your use case, please contact us at info@netzint.de for clarification.
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownSelect from './DropdownSelect';
import type { DropdownOptions } from './DropdownSelect';

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

describe('DropdownSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
