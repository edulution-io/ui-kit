/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import axe from 'axe-core';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const danglingAriaControls = (container: HTMLElement): string[] =>
  [...container.querySelectorAll('[aria-controls]')]
    .map((element) => element.getAttribute('aria-controls'))
    .filter((id): id is string => !!id && !container.ownerDocument.getElementById(id));

const runAxe = async (container: HTMLElement): Promise<axe.Result[]> => {
  const results = await axe.run(container, {
    runOnly: { type: 'rule', values: ['aria-valid-attr-value'] },
  });
  return results.violations;
};

const PanelLessTabs = () => (
  <Tabs value="all">
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="unread">Unread</TabsTrigger>
    </TabsList>
  </Tabs>
);

const PaneledTabs = () => (
  <Tabs value="all">
    <TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="unread">Unread</TabsTrigger>
    </TabsList>
    <TabsContent
      value="all"
      className="hidden"
    />
    <TabsContent
      value="unread"
      className="hidden"
    />
  </Tabs>
);

describe('Tabs accessibility (real Radix)', () => {
  afterEach(cleanup);

  it('a segmented control WITHOUT TabsContent leaves every trigger pointing at a missing panel', async () => {
    const { container } = render(<PanelLessTabs />);

    expect(danglingAriaControls(container).length).toBeGreaterThan(0);
    expect(await runAxe(container)).not.toEqual([]);
  });

  it('adding empty hidden TabsContent makes every aria-controls resolve and clears the axe violation', async () => {
    const { container } = render(<PaneledTabs />);

    expect(danglingAriaControls(container)).toEqual([]);
    expect(await runAxe(container)).toEqual([]);
  });
});
