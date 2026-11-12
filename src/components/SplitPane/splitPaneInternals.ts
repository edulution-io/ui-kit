/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
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

export type SplitPaneSide = 'left' | 'right' | 'end';

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  end?: React.ReactNode;
  orientation?: SplitPaneOrientation;
  defaultLeftSize?: number | SplitPanePreset;
  minLeftSize?: number;
  maxLeftSize?: number;
  autoSaveId?: string;
  fitLeftSize?: string | null;
  defaultEndSize?: number | SplitPanePreset;
  minEndSize?: number;
  maxEndSize?: number;
  fitEndSize?: string | null;
  endHandleAriaLabel?: string;
  mobilePane?: SplitPaneSide;
  mobileBreakpointQuery?: string;
  handleAriaLabel?: string;
  withHandle?: boolean;
  className?: string;
}

export const SPLIT_PANE_LEFT_PANEL_ID = 'split-pane-left';
export const SPLIT_PANE_RIGHT_PANEL_ID = 'split-pane-right';
export const SPLIT_PANE_END_PANEL_ID = 'split-pane-end';
export const SPLIT_PANE_PANEL_IDS = [SPLIT_PANE_LEFT_PANEL_ID, SPLIT_PANE_RIGHT_PANEL_ID];
export const SPLIT_PANE_PANEL_IDS_WITH_END = [...SPLIT_PANE_PANEL_IDS, SPLIT_PANE_END_PANEL_ID];
export const SPLIT_PANE_FITTED_RESIZE_BEHAVIOR = 'preserve-pixel-size';

export const SPLIT_PANE_GROUP_CLASSES = 'h-full min-h-0 w-full';
export const SPLIT_PANE_PANEL_CLASSES = 'flex h-full min-h-0 flex-col';
export const SPLIT_PANE_MOBILE_CLASSES = 'flex h-full min-h-0 w-full flex-col';

export const DEFAULT_MOBILE_BREAKPOINT_QUERY = '(max-width: 767px)';
export const DEFAULT_MOBILE_PANE: SplitPaneSide = 'left';
export const DEFAULT_MIN_LEFT_SIZE = 20;
export const DEFAULT_MAX_LEFT_SIZE = 80;
export const DEFAULT_MIN_END_SIZE = 10;
export const DEFAULT_MAX_END_SIZE = 40;

const FALLBACK_PRESET: SplitPanePreset = '1/3';
const FALLBACK_END_PRESET: SplitPanePreset = '1/4';

const PANEL_SIZE_CHANGE_THRESHOLD = 0.01;

export const toPercent = (value: number): string => `${value}%`;

export const toPanelSetKey = (panelIds: string[]): string => [...panelIds].sort().join(',');

export const hasPanelSizeChanged = (
  previousLayout: Record<string, number> | undefined,
  nextLayout: Record<string, number>,
  panelId: string,
): boolean => {
  const next = nextLayout[panelId];
  if (next === undefined) return false;
  const previous = previousLayout?.[panelId];
  return previous === undefined || Math.abs(previous - next) > PANEL_SIZE_CHANGE_THRESHOLD;
};

const resolveSize = (size: number | SplitPanePreset | undefined, fallback: SplitPanePreset): number => {
  if (typeof size === 'number') return size;
  if (size && size in SPLIT_PANE_PRESET_TO_PERCENT) {
    return SPLIT_PANE_PRESET_TO_PERCENT[size];
  }
  return SPLIT_PANE_PRESET_TO_PERCENT[fallback];
};

export const resolveLeftSize = (size: SplitPaneProps['defaultLeftSize']): number => resolveSize(size, FALLBACK_PRESET);

export const resolveEndSize = (size: SplitPaneProps['defaultEndSize']): number =>
  resolveSize(size, FALLBACK_END_PRESET);

export const hasEndPane = (end: React.ReactNode): boolean => end !== undefined && end !== null && end !== false;

export const pickMobilePane = (
  { left, right, end }: Pick<SplitPaneProps, 'left' | 'right' | 'end'>,
  mobilePane: SplitPaneSide,
): React.ReactNode => {
  if (mobilePane === 'left') return left;
  if (mobilePane === 'end' && hasEndPane(end)) return end;
  return right;
};
