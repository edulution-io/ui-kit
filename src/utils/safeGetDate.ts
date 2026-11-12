/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const safeGetDate = (dateValue: unknown): Date => (dateValue instanceof Date ? new Date(dateValue) : new Date());

export default safeGetDate;
