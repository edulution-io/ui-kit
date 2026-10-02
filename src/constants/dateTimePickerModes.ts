/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const DATETIME_PICKER_MODES = {
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
} as const;

export type TDateTimePickerMode = (typeof DATETIME_PICKER_MODES)[keyof typeof DATETIME_PICKER_MODES];

export default DATETIME_PICKER_MODES;
