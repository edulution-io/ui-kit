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

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from 'react';

vi.mock('cmdk', () => {
  const Command = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="cmdk-root"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Command.displayName = 'Command';
  Command.Input = React.forwardRef(({ className, ...props }: any, ref: any) => (
    <input
      ref={ref}
      data-testid="cmdk-input"
      className={className}
      {...props}
    />
  ));
  Command.Input.displayName = 'CommandInput';
  Command.List = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="cmdk-list"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Command.List.displayName = 'CommandList';
  Command.Empty = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="cmdk-empty"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Command.Empty.displayName = 'CommandEmpty';
  Command.Group = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="cmdk-group"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Command.Group.displayName = 'CommandGroup';
  Command.Item = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="cmdk-item"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Command.Item.displayName = 'CommandItem';
  Command.Separator = React.forwardRef(({ className, ...props }: any, ref: any) => (
    <hr
      ref={ref}
      data-testid="cmdk-separator"
      className={className}
      {...props}
    />
  ));
  Command.Separator.displayName = 'CommandSeparator';
  return { Command };
});

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

import { render, screen } from '@testing-library/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './Command';

describe('Command', () => {
  it('renders with children', () => {
    render(<Command>content</Command>);
    expect(screen.getByTestId('cmdk-root')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Command className="custom-cmd" />);
    expect(screen.getByTestId('cmdk-root').className).toContain('custom-cmd');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Command ref={ref}>content</Command>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CommandInput', () => {
  it('renders search icon and input', () => {
    render(<CommandInput placeholder="Search..." />);
    expect(screen.getByTestId('cmdk-input')).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('forwards placeholder prop', () => {
    render(<CommandInput placeholder="Type here" />);
    expect(screen.getByTestId('cmdk-input')).toHaveAttribute('placeholder', 'Type here');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<CommandInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('CommandList', () => {
  it('renders children', () => {
    render(<CommandList>list content</CommandList>);
    expect(screen.getByText('list content')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<CommandList className="custom-list" />);
    expect(screen.getByTestId('cmdk-list').className).toContain('custom-list');
  });
});

describe('CommandEmpty', () => {
  it('renders empty state text', () => {
    render(<CommandEmpty>No results</CommandEmpty>);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

describe('CommandGroup', () => {
  it('renders group with items', () => {
    render(
      <CommandGroup>
        <CommandItem>Item 1</CommandItem>
      </CommandGroup>,
    );
    expect(screen.getByTestId('cmdk-group')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});

describe('CommandItem', () => {
  it('renders item content', () => {
    render(<CommandItem>Action</CommandItem>);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<CommandItem className="item-custom">Action</CommandItem>);
    expect(screen.getByTestId('cmdk-item').className).toContain('item-custom');
  });
});

describe('CommandShortcut', () => {
  it('renders shortcut text', () => {
    render(<CommandShortcut>Ctrl+K</CommandShortcut>);
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<CommandShortcut className="shortcut-custom">Ctrl+K</CommandShortcut>);
    const span = container.firstElementChild as HTMLElement;
    expect(span.className).toContain('shortcut-custom');
  });
});

describe('CommandSeparator', () => {
  it('renders a separator element', () => {
    render(<CommandSeparator />);
    expect(screen.getByTestId('cmdk-separator')).toBeInTheDocument();
  });
});
