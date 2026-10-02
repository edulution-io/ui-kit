/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type IdentifiableItem from './identifiableItem';

interface ActionableItem extends IdentifiableItem {
  action: () => void;
  children?: ActionableItem[];
}

const buildActionMap = <T extends ActionableItem>(items: T[]): Map<string, () => void> => {
  const map = new Map<string, () => void>();
  const walk = (nodes: T[]) => {
    nodes.forEach((node) => {
      map.set(node.id, node.action);
      if (node.children) walk(node.children as T[]);
    });
  };
  walk(items);
  return map;
};

export default buildActionMap;
