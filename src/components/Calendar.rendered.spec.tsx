/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Calendar } from './Calendar';

const JUNE_2026 = new Date(2026, 5, 1);
const RANGE_FROM = new Date(2026, 5, 10);
const RANGE_TO = new Date(2026, 5, 14);
const OUTSIDE_DAY = new Date(2026, 4, 31);

const getNavButton = (container: HTMLElement, direction: 'previous' | 'next'): HTMLButtonElement => {
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('nav button'));
  const button = direction === 'previous' ? buttons[0] : buttons[buttons.length - 1];
  if (!button) throw new Error(`no ${direction} navigation button rendered`);
  return button;
};

const cellFor = (container: HTMLElement, isoDate: string) =>
  container.querySelector<HTMLTableCellElement>(`td[data-day="${isoDate}"]`);

const renderSingle = () =>
  render(
    <Calendar
      mode="single"
      defaultMonth={JUNE_2026}
    />,
  );

const renderRange = () =>
  render(
    <Calendar
      mode="range"
      defaultMonth={JUNE_2026}
      selected={{ from: RANGE_FROM, to: RANGE_TO }}
    />,
  );

describe('Calendar rendered against the real react-day-picker', () => {
  it('applies the v9 grid class names to the elements they name', () => {
    const { container } = renderSingle();

    expect(container.querySelector('table')?.className).toContain('border-collapse');
    expect(container.querySelector('thead tr')?.className).toContain('flex');
    expect(container.querySelector('thead th')?.className).toContain('text-muted-foreground');
    expect(container.querySelector('tbody tr')?.className).toContain('flex w-full mt-2');
    expect(container.querySelector('tbody td')?.className).toContain('h-9 w-9');
    expect(container.querySelector('tbody td button')?.className).toContain('font-normal');
  });

  it('applies the v9 caption and navigation class names', () => {
    const { container } = renderSingle();

    expect(container.querySelector('nav')?.className).toContain('absolute inset-x-0');
    expect(getNavButton(container, 'previous').className).toContain('ml-1');
    expect(getNavButton(container, 'next').className).toContain('mr-1');
  });

  it('keeps its own Chevron when a consumer supplies other components', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        components={{ MonthCaption: () => <div>caption</div> }}
      />,
    );

    expect(getNavButton(container, 'previous').querySelector('svg')).toHaveAttribute('data-icon', 'chevron-left');
    expect(getNavButton(container, 'next').querySelector('svg')).toHaveAttribute('data-icon', 'chevron-right');
  });

  it('renders the components a consumer supplies alongside its own Chevron', () => {
    const { getByText } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        components={{ MonthCaption: () => <div>consumer caption</div> }}
      />,
    );

    expect(getByText('consumer caption')).toBeInTheDocument();
  });

  it('lets clicks through the empty middle of the full-width navigation bar', () => {
    const { container } = renderSingle();

    expect(container.querySelector('nav')?.className).toContain('pointer-events-none');
    expect(getNavButton(container, 'previous').className).toContain('pointer-events-auto');
    expect(getNavButton(container, 'next').className).toContain('pointer-events-auto');
  });

  it('points the navigation chevrons in the direction they navigate', () => {
    const { container } = renderSingle();

    expect(getNavButton(container, 'previous').querySelector('svg')).toHaveAttribute('data-icon', 'chevron-left');
    expect(getNavButton(container, 'next').querySelector('svg')).toHaveAttribute('data-icon', 'chevron-right');
  });

  it('rounds the ends of a selected range on the day cells', () => {
    const { container } = renderRange();

    expect(container.querySelector('td.day-range-start')?.className).toContain('rounded-l-md');
    expect(container.querySelector('td.day-range-end')?.className).toContain('rounded-r-md');
  });

  it('paints the range middle over the selected background', () => {
    const { container } = renderRange();

    expect(cellFor(container, '2026-06-12')?.className).toContain('[&>button]:!bg-accent');
    expect(cellFor(container, '2026-06-12')?.className).toContain('[&>button]:!text-accent-foreground');
  });

  it('leaves the range endpoints painted by the selected background alone', () => {
    const { container } = renderRange();

    expect(cellFor(container, '2026-06-10')?.className).not.toContain('[&>button]:!bg-accent');
    expect(cellFor(container, '2026-06-14')?.className).not.toContain('[&>button]:!bg-accent');
    expect(cellFor(container, '2026-06-10')?.className).toContain('[&>button]:bg-primary');
  });

  it('styles every selection state itself instead of falling back to an unstyled rdp- class', () => {
    const { container } = renderRange();

    const selectedCells = Array.from(container.querySelectorAll('td[aria-selected="true"]'));

    expect(selectedCells).not.toHaveLength(0);
    selectedCells.forEach((cell) => expect(cell.className).not.toContain('rdp-'));
  });

  it('keeps the selected day button rounded rather than painting a square cell', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        selected={new Date(2026, 5, 15)}
      />,
    );

    const selectedCell = cellFor(container, '2026-06-15');
    expect(selectedCell).toHaveAttribute('aria-selected', 'true');
    expect(selectedCell?.className).toContain('[&>button]:bg-primary');
    expect(selectedCell?.className).toContain('[&>button]:rounded-lg');
  });

  it('dims days rejected by the disabled matcher', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        disabled={(date) => date.getDate() === 11}
      />,
    );

    const cell = cellFor(container, '2026-06-11');
    expect(cell).toHaveAttribute('data-disabled', 'true');
    expect(cell?.className).toContain('text-muted-foreground opacity-50');
    expect(cellFor(container, '2026-06-12')?.className).not.toContain('opacity-50');
  });

  it('paints today through the day button rather than the square cell behind it', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        today={new Date(2026, 5, 15)}
      />,
    );

    const cell = cellFor(container, '2026-06-15');
    expect(cell).toHaveAttribute('data-today', 'true');

    const classes = cell?.className.split(/\s+/) ?? [];
    expect(classes).toContain('[&>button]:bg-accent');
    expect(classes).toContain('[&>button]:rounded-lg');
    expect(classes).not.toContain('bg-accent');
    expect(classes).not.toContain('rounded-lg');
  });

  it('renders the dropdown caption chevron with the down orientation', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        captionLayout="dropdown"
        startMonth={new Date(2024, 0, 1)}
        endMonth={new Date(2028, 11, 31)}
      />,
    );

    expect(container.querySelector('svg[data-icon="chevron-down"]')).not.toBeNull();
  });

  it('marks outside days on the day cell', () => {
    const { container } = renderSingle();

    expect(container.querySelector('td.day-outside')).not.toBeNull();
  });

  it('dims a selected outside day through the day button the selection also paints', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        selected={OUTSIDE_DAY}
      />,
    );

    const outsideCell = cellFor(container, '2026-05-31');
    expect(outsideCell).toHaveClass('day-outside');
    expect(outsideCell).toHaveAttribute('aria-selected', 'true');
    expect(outsideCell?.className).toContain('[&[aria-selected]>button]:bg-accent/50');
    expect(outsideCell?.className).toContain('[&[aria-selected]>button]:text-muted-foreground');
    expect(outsideCell?.className).not.toContain('aria-selected:bg-accent/50');
  });

  it('hides outside days instead of dropping them when showOutsideDays is false', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        showOutsideDays={false}
      />,
    );

    const outsideDay = container.querySelector('td.day-outside');
    expect(outsideDay).toHaveAttribute('data-hidden', 'true');
    expect(outsideDay?.className).toContain('invisible');
  });
  it('labels a day button with the localized date and no hardcoded English', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        today={new Date(2026, 5, 15)}
        selected={new Date(2026, 5, 15)}
      />,
    );

    const label = container.querySelector('td[data-day="2026-06-15"] button')?.getAttribute('aria-label');

    expect(label).toContain('June');
    expect(label).not.toContain('Today');
    expect(label).not.toContain('selected');
  });

  it('keeps its own day label when a consumer overrides a different label key', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        today={new Date(2026, 5, 15)}
        labels={{ labelMonthDropdown: () => 'month' }}
      />,
    );

    const label = container.querySelector('td[data-day="2026-06-15"] button')?.getAttribute('aria-label');

    expect(label).not.toContain('Today');
  });

  it('lets a consumer replace the day label outright', () => {
    const { container } = render(
      <Calendar
        mode="single"
        defaultMonth={JUNE_2026}
        labels={{ labelDayButton: () => 'consumer label' }}
      />,
    );

    expect(container.querySelector('td[data-day="2026-06-15"] button')).toHaveAttribute('aria-label', 'consumer label');
  });
});
