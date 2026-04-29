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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBarSearchInput from './MenuBarSearchInput';

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
    const input = screen.getByPlaceholderText('Search');
    input.focus();
    await user.keyboard('{Escape}');
    expect(onQueryChange).toHaveBeenCalledWith('');
    expect(parentKeyDown).not.toHaveBeenCalled();
  });

  it('stops propagation on Escape when query is empty but does not fire onQueryChange', async () => {
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
    screen.getByPlaceholderText('Search').focus();
    await user.keyboard('{Escape}');
    expect(onQueryChange).not.toHaveBeenCalled();
    expect(parentKeyDown).not.toHaveBeenCalled();
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
