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
