/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, @typescript-eslint/no-var-requires, global-require, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

vi.mock('@radix-ui/react-tabs', () => {
  const React = require('react');
  const Root = ({ children, ...props }: any) => (
    <div
      data-testid="tabs-root"
      {...props}
    >
      {children}
    </div>
  );
  const List = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      data-testid="tabs-list"
      className={className}
      role="tablist"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  List.displayName = 'TabsList';
  const Trigger = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      data-testid="tabs-trigger"
      className={className}
      role="tab"
      ref={ref}
      {...props}
    >
      {children}
    </button>
  ));
  Trigger.displayName = 'TabsTrigger';
  const Content = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      data-testid="tabs-content"
      className={className}
      role="tabpanel"
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = 'TabsContent';
  return { Root, List, Trigger, Content };
});

vi.mock('../utils/cn', () => ({
  default: (...args: any[]) => args.filter(Boolean).join(' '),
}));

import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs', () => {
  it('renders tabs with list and triggers', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('renders TabsContent with children', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent value="tab1">Panel 1</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
  });

  it('applies custom className to TabsList', () => {
    render(
      <Tabs>
        <TabsList className="extra-class">
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-list').className).toContain('extra-class');
  });

  it('applies custom className to TabsTrigger', () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger
            value="a"
            className="trigger-custom"
          >
            A
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-trigger').className).toContain('trigger-custom');
  });

  it('applies custom className to TabsContent', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsContent
          value="tab1"
          className="content-custom"
        >
          Panel
        </TabsContent>
      </Tabs>,
    );
    expect(screen.getByTestId('tabs-content').className).toContain('content-custom');
  });

  it('forwards ref to TabsList', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs>
        <TabsList ref={ref}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(ref.current).toBe(screen.getByTestId('tabs-list'));
  });

  it('forwards ref to TabsTrigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger
            value="a"
            ref={ref}
          >
            A
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(ref.current).toBe(screen.getByTestId('tabs-trigger'));
  });

  it('forwards ref to TabsContent', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="tab1">
        <TabsContent
          value="tab1"
          ref={ref}
        >
          Panel
        </TabsContent>
      </Tabs>,
    );
    expect(ref.current).toBe(screen.getByTestId('tabs-content'));
  });

  it('shows a scrollbar on a phone and hides it from md up, so an overflowing tab bar signals that it scrolls', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">One</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const list = screen.getByTestId('tabs-list');
    expect(list).toHaveClass('overflow-x-auto', 'scrollbar-thin', 'md:scrollbar-none');
    expect(list).not.toHaveClass('scrollbar-none');
  });
});
