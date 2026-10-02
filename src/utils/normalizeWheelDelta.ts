/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const DOM_DELTA_LINE = 1;
const DOM_DELTA_PAGE = 2;
const LINE_HEIGHT_PX = 16;

const normalizeWheelDelta = (event: Pick<WheelEvent, 'deltaMode' | 'deltaY'>, pageSize: number): number => {
  const lineFactor = event.deltaMode === DOM_DELTA_LINE ? LINE_HEIGHT_PX : 1;
  const pageFactor = event.deltaMode === DOM_DELTA_PAGE ? pageSize : 1;
  return event.deltaY * lineFactor * pageFactor;
};

export default normalizeWheelDelta;
