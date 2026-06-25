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

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ className }: { className?: string }) => (
    <span
      data-testid="fa-icon"
      className={className}
    />
  ),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBarItemActions from './MenuBarItemActions';
import type MenuBarItemAction from './MenuBarItemAction';

const makeActions = (overrides: Partial<MenuBarItemAction>[] = []): MenuBarItemAction[] =>
  overrides.map((o, index) => ({
    id: `action-${index}`,
    label: `Action ${index}`,
    onClick: vi.fn(),
    ...o,
  }));

describe('MenuBarItemActions', () => {
  it('renders nothing when there are no actions', () => {
    const { container } = render(
      <MenuBarItemActions
        actions={[]}
        label="Actions"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a trigger with the provided accessible label', () => {
    render(
      <MenuBarItemActions
        actions={makeActions([{ label: 'Rename' }])}
        label="Folder actions"
      />,
    );
    expect(screen.getByRole('button', { name: 'Folder actions' })).toBeInTheDocument();
  });

  it('opens the menu and lists the action labels', async () => {
    const user = userEvent.setup();
    render(
      <MenuBarItemActions
        actions={makeActions([{ label: 'Rename' }, { label: 'Delete' }])}
        label="Actions"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('invokes the action onClick when its menu item is selected', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MenuBarItemActions
        actions={makeActions([{ label: 'Rename', onClick }])}
        label="Actions"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByText('Rename'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not bubble trigger clicks to the surrounding row', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <div
        role="button"
        tabIndex={0}
        onClick={onRowClick}
        onKeyDown={() => undefined}
      >
        <MenuBarItemActions
          actions={makeActions([{ label: 'Rename' }])}
          label="Actions"
        />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('styles destructive actions with the destructive token', async () => {
    const user = userEvent.setup();
    render(
      <MenuBarItemActions
        actions={makeActions([{ label: 'Delete', isDestructive: true, separatorBefore: true }])}
        label="Actions"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByText('Delete').closest('[role="menuitem"]')?.className).toContain('text-destructive');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
