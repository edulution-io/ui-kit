/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import type IdentifiableItem from './identifiableItem';

const findInTree = <T extends IdentifiableItem>(
  items: T[] | undefined,
  predicate: (item: T) => boolean,
): T | undefined => {
  if (!items) return undefined;
  let found: T | undefined;
  items.some((item) => {
    if (predicate(item)) {
      found = item;
      return true;
    }
    found = findInTree(item.children as T[] | undefined, predicate);
    return !!found;
  });
  return found;
};

export default findInTree;
