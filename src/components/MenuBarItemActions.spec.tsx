/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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

  it('renders a separator before an action without applying destructive styling', async () => {
    const user = userEvent.setup();
    render(
      <MenuBarItemActions
        actions={makeActions([{ label: 'Delete', separatorBefore: true }])}
        label="Actions"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByText('Delete').closest('[role="menuitem"]')?.className).not.toContain('text-destructive');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
