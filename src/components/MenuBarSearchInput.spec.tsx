/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBarSearchInput from './MenuBarSearchInput';
import { Dialog, DialogContent, DialogTitle } from './Dialog';

describe('MenuBarSearchInput', () => {
  it('renders a controlled input with the provided placeholder', () => {
    render(
      <MenuBarSearchInput
        query=""
        onQueryChange={vi.fn()}
        placeholder="Search sections"
      />,
    );
    expect(screen.getByPlaceholderText('Search sections')).toBeInTheDocument();
  });

  it('reflects the controlled query value', () => {
    render(
      <MenuBarSearchInput
        query="hello"
        onQueryChange={vi.fn()}
        placeholder="Search"
      />,
    );
    expect(screen.getByPlaceholderText('Search')).toHaveValue('hello');
  });

  it('fires onQueryChange on every keystroke', async () => {
    const onQueryChange = vi.fn();
    const user = userEvent.setup();
    render(
      <MenuBarSearchInput
        query=""
        onQueryChange={onQueryChange}
        placeholder="Search"
      />,
    );
    await user.type(screen.getByPlaceholderText('Search'), 'ab');
    expect(onQueryChange).toHaveBeenCalledWith('a');
    expect(onQueryChange).toHaveBeenCalledWith('b');
  });

  it('hides the clear button when query is empty', () => {
    render(
      <MenuBarSearchInput
        query=""
        onQueryChange={vi.fn()}
        placeholder="Search"
      />,
    );
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('shows the clear button when query has content and uses the custom label', () => {
    render(
      <MenuBarSearchInput
        query="abc"
        onQueryChange={vi.fn()}
        placeholder="Search"
        clearLabel="Leeren"
      />,
    );
    expect(screen.getByRole('button', { name: 'Leeren' })).toBeInTheDocument();
  });

  it('clears the query when the clear button is clicked without firing onSubmit', async () => {
    const onQueryChange = vi.fn();
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <MenuBarSearchInput
        query="abc"
        onQueryChange={onQueryChange}
        onSubmit={onSubmit}
        placeholder="Search"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onQueryChange).toHaveBeenCalledWith('');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears and stops propagation on Escape when query has content', async () => {
    const onQueryChange = vi.fn();
    const parentKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={parentKeyDown}>
        <MenuBarSearchInput
          query="abc"
          onQueryChange={onQueryChange}
          placeholder="Search"
        />
      </div>,
    );
    await user.click(screen.getByPlaceholderText('Search'));
    await user.keyboard('{Escape}');
    expect(onQueryChange).toHaveBeenCalledWith('');
    expect(parentKeyDown).not.toHaveBeenCalled();
  });

  it('lets Escape through when there is nothing to clear, so a surrounding layer can close', async () => {
    const onQueryChange = vi.fn();
    const parentKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={parentKeyDown}>
        <MenuBarSearchInput
          query=""
          onQueryChange={onQueryChange}
          placeholder="Search"
        />
      </div>,
    );
    await user.click(screen.getByPlaceholderText('Search'));
    await user.keyboard('{Escape}');
    expect(onQueryChange).not.toHaveBeenCalled();
    expect(parentKeyDown).toHaveBeenCalled();
  });

  it('lets Escape through once the input has lost focus', async () => {
    const onQueryChange = vi.fn();
    const parentKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={parentKeyDown}>
        <MenuBarSearchInput
          query="abc"
          onQueryChange={onQueryChange}
          placeholder="Search"
        />
        <button type="button">Elsewhere</button>
      </div>,
    );
    await user.click(screen.getByPlaceholderText('Search'));
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await user.keyboard('{Escape}');
    expect(onQueryChange).not.toHaveBeenCalled();
    expect(parentKeyDown).toHaveBeenCalled();
  });

  it('keeps a surrounding dialog open while clearing the query, and closes it on the second Escape', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    const Host = () => {
      const [query, setQuery] = useState('abc');
      return (
        <Dialog
          open
          onOpenChange={onOpenChange}
        >
          <DialogContent>
            <DialogTitle>Sections</DialogTitle>
            <MenuBarSearchInput
              query={query}
              onQueryChange={setQuery}
              placeholder="Search"
            />
          </DialogContent>
        </Dialog>
      );
    };
    render(<Host />);

    await user.click(screen.getByPlaceholderText('Search'));
    await user.keyboard('{Escape}');

    expect(screen.getByPlaceholderText('Search')).toHaveValue('');
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('fires onSubmit with the trimmed query on Enter', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <MenuBarSearchInput
        query="  hello  "
        onQueryChange={vi.fn()}
        onSubmit={onSubmit}
        placeholder="Search"
      />,
    );
    screen.getByPlaceholderText('Search').focus();
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not fire onSubmit on Enter when the trimmed query is empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <MenuBarSearchInput
        query="   "
        onQueryChange={vi.fn()}
        onSubmit={onSubmit}
        placeholder="Search"
      />,
    );
    screen.getByPlaceholderText('Search').focus();
    await user.keyboard('{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not throw when Enter is pressed without onSubmit', async () => {
    const user = userEvent.setup();
    render(
      <MenuBarSearchInput
        query="abc"
        onQueryChange={vi.fn()}
        placeholder="Search"
      />,
    );
    screen.getByPlaceholderText('Search').focus();
    await user.keyboard('{Enter}');
  });
});
