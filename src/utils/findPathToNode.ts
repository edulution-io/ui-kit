/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type IdentifiableItem from './identifiableItem';

const findPathToNode = <T extends IdentifiableItem>(items: T[], targetId: string): string[] => {
  let result: string[] = [];
  items.some((item) => {
    if (item.id === targetId) {
      result = [item.id];
      return true;
    }
    if (item.children) {
      const path = findPathToNode(item.children, targetId);
      if (path.length > 0) {
        result = [item.id, ...path];
        return true;
      }
    }
    return false;
  });
  return result;
};

export default findPathToNode;
