/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

const CLOSING_DIALOG_SELECTOR = '[role="dialog"][data-state="closed"]';

const ignorePressFromClosingLayer = (event: CustomEvent<{ originalEvent: PointerEvent }>): void => {
  const { target } = event.detail.originalEvent;
  if (!(target instanceof Node)) return;

  const isRemoved = !target.isConnected;
  const isInClosingDialog = target instanceof Element && target.closest(CLOSING_DIALOG_SELECTOR) !== null;
  if (isRemoved || isInClosingDialog) event.preventDefault();
};

export default ignorePressFromClosingLayer;
