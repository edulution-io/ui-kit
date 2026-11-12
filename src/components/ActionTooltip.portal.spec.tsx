/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionTooltip from './ActionTooltip';
import { TooltipProvider } from './Tooltip';

const CLIPPING_CONTAINER_TEST_ID = 'clipping-container';
const OVERLAY_STACKING_CLASS = 'z-50';
const TOOLTIP_CONTENT_SELECTOR = '[data-side]';
const TRIGGER_TEXT = 'Open in new tab';
const TOOLTIP_TEXT = 'Open the file in a new tab';

const openTooltip = async () => {
  render(
    <TooltipProvider delayDuration={0}>
      <div
        data-testid={CLIPPING_CONTAINER_TEST_ID}
        className="overflow-hidden"
      >
        <ActionTooltip
          trigger={<span>{TRIGGER_TEXT}</span>}
          tooltipText={TOOLTIP_TEXT}
        />
      </div>
    </TooltipProvider>,
  );

  await userEvent.hover(screen.getByText(TRIGGER_TEXT));

  return screen.findByRole('tooltip');
};

describe('ActionTooltip portal', () => {
  it('renders the tooltip outside the container of its trigger, so no overflow above it can clip it', async () => {
    const tooltip = await openTooltip();

    expect(tooltip).toHaveTextContent(TOOLTIP_TEXT);
    expect(screen.getByTestId(CLIPPING_CONTAINER_TEST_ID)).not.toContainElement(tooltip);
  });

  it('gives the tooltip the stacking order of the other ui-kit overlays', async () => {
    const tooltip = await openTooltip();

    expect(tooltip.closest(TOOLTIP_CONTENT_SELECTOR)).toHaveClass(OVERLAY_STACKING_CLASS);
  });
});
