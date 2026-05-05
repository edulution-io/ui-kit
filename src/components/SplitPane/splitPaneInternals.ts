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

const SPLIT_PANE_PRESET_TO_PERCENT = {
  '1/4': 25,
  '1/3': 100 / 3,
  '1/2': 50,
  '2/3': 200 / 3,
  '3/4': 75,
} as const;

export type SplitPanePreset = keyof typeof SPLIT_PANE_PRESET_TO_PERCENT;

export type SplitPaneOrientation = 'horizontal' | 'vertical';

export type SplitPaneSide = 'left' | 'right';

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  orientation?: SplitPaneOrientation;
  defaultLeftSize?: number | SplitPanePreset;
  minLeftSize?: number;
  maxLeftSize?: number;
  autoSaveId?: string;
  mobilePane?: SplitPaneSide;
  mobileBreakpointQuery?: string;
  handleAriaLabel?: string;
  withHandle?: boolean;
  className?: string;
}

export const SPLIT_PANE_LEFT_PANEL_ID = 'split-pane-left';
export const SPLIT_PANE_RIGHT_PANEL_ID = 'split-pane-right';
export const SPLIT_PANE_PANEL_IDS = [SPLIT_PANE_LEFT_PANEL_ID, SPLIT_PANE_RIGHT_PANEL_ID];

export const SPLIT_PANE_GROUP_CLASSES = 'h-full min-h-0 w-full';
export const SPLIT_PANE_PANEL_CLASSES = 'flex h-full min-h-0 flex-col';
export const SPLIT_PANE_MOBILE_CLASSES = 'flex h-full min-h-0 w-full flex-col';

export const DEFAULT_MOBILE_BREAKPOINT_QUERY = '(max-width: 767px)';
export const DEFAULT_MOBILE_PANE: SplitPaneSide = 'left';
export const DEFAULT_MIN_LEFT_SIZE = 20;
export const DEFAULT_MAX_LEFT_SIZE = 80;

const FALLBACK_PRESET: SplitPanePreset = '1/3';

export const toPercent = (value: number): string => `${value}%`;

export const resolveLeftSize = (size: SplitPaneProps['defaultLeftSize']): number => {
  if (typeof size === 'number') return size;
  if (size && size in SPLIT_PANE_PRESET_TO_PERCENT) {
    return SPLIT_PANE_PRESET_TO_PERCENT[size];
  }
  return SPLIT_PANE_PRESET_TO_PERCENT[FALLBACK_PRESET];
};
