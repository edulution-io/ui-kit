/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChevronLeft, faChevronRight, faClock, faXmark } from '@fortawesome/free-solid-svg-icons';
import cn from '../utils/cn';
import getUsableTimeZone from '../utils/getUsableTimeZone';
import readWallClock from '../utils/readWallClock';
import resolveWallClock from '../utils/resolveWallClock';
import toCalendarDay from '../utils/toCalendarDay';
import toDisplayMonth from '../utils/toDisplayMonth';
import isValidDate from '../utils/isValidDate';
import withTodayForInvalidBase from '../utils/withTodayForInvalidBase';
import normalizeWheelDelta from '../utils/normalizeWheelDelta';
import DATETIME_PICKER_MODES, { TDateTimePickerMode } from '../constants/dateTimePickerModes';
import { Button } from './Button';
import { Calendar, CalendarProps } from './Calendar';
import { Popover, PopoverAnchor, PopoverContent } from './Popover';
import { ScrollArea } from './ScrollArea';
import MonthYearSelect, { MonthYearOption } from './MonthYearSelect';
import buildMonthOptions from '../utils/buildMonthOptions';
import buildYearOptions from '../utils/buildYearOptions';
import HourButton from './HourButton';
import MinuteButton from './MinuteButton';
import { DropdownVariant } from './DropdownSelect';
import type WallClock from '../utils/wallClock';
import usePopoverOutsideDismiss from '../hooks/usePopoverOutsideDismiss';
import useEscapeCapture from '../hooks/useEscapeCapture';

const SCROLL_AREA_VIEWPORT_SELECTOR = '[data-radix-scroll-area-viewport]';
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MAX_HOUR = 23;
const MAX_MINUTE = 59;
const DEFAULT_MINUTE_STEP = 5;
const DEFAULT_YEARS_IN_PAST = 120;
const DEFAULT_YEARS_IN_FUTURE = 10;
const MONTH_SAMPLE_YEAR = 2000;
const SINGLE_CLICK_OPEN_DELAY_MS = 180;
const POPOVER_COLLISION_PADDING_PX = 8;
const YEAR_DIGITS = 4;
const REQUIRED_DATE_PART_COUNT = 3;
const MIN_TYPED_YEAR = 100;
const TIME_MASK = 'HH:mm';
const DRAFT_SEGMENT_SEPARATOR = ' ';
const DEFAULT_DATE_SEPARATOR = '.';
const TIME_DRAFT_PATTERN = /(\d{1,2}):(\d{1,2})/;
const DATE_NUMBER_PATTERN = /\d+/g;
const MASK_SAMPLE_DATE = new Date(2000, 11, 31, 23, 59);

type DatePartType = 'day' | 'month' | 'year';

interface DateFormatInfo {
  order: DatePartType[];
  separator: string;
}

const DATE_PART_TOKENS: Record<DatePartType, string> = { day: 'dd', month: 'MM', year: 'yyyy' };
const DEFAULT_DATE_ORDER: DatePartType[] = ['day', 'month', 'year'];

const isDatePartType = (type: string): type is DatePartType => type === 'day' || type === 'month' || type === 'year';

const scrollSelectedIntoView = (list: HTMLDivElement | null, selectedIndex: number): void => {
  const selected = list?.children.item(selectedIndex);
  const viewport = list?.closest<HTMLElement>(SCROLL_AREA_VIEWPORT_SELECTOR);
  if (!selected || !viewport) return;
  const viewportRect = viewport.getBoundingClientRect();
  const selectedRect = selected.getBoundingClientRect();
  viewport.scrollLeft += selectedRect.left - viewportRect.left - (viewportRect.width - selectedRect.width) / 2;
  viewport.scrollTop += selectedRect.top - viewportRect.top - (viewportRect.height - selectedRect.height) / 2;
};

const getHeightHiddenBelow = (container: HTMLElement, target: HTMLElement): number =>
  target.getBoundingClientRect().bottom -
  container.getBoundingClientRect().top -
  container.clientTop -
  container.clientHeight;

const scrollViewportOnWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
  const viewport = event.currentTarget.closest<HTMLElement>(SCROLL_AREA_VIEWPORT_SELECTOR);
  if (!viewport) return;
  viewport.scrollTop += normalizeWheelDelta(event, viewport.clientHeight);
};

const padTwo = (value: number): string => value.toString().padStart(2, '0');

const clamp = (value: number, max: number): number => Math.min(Math.max(value, 0), max);

const toValueDate = (value: unknown): Date | null => (value instanceof Date ? value : null);

const getDateFormatInfo = (locale: string): DateFormatInfo => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(MASK_SAMPLE_DATE);
  const order: DatePartType[] = [];
  let separator = DEFAULT_DATE_SEPARATOR;
  parts.forEach((part) => {
    if (isDatePartType(part.type)) {
      order.push(part.type);
    } else if (part.type === 'literal') {
      const candidate = part.value.trim();
      if (candidate) [separator] = candidate;
    }
  });
  return order.length === REQUIRED_DATE_PART_COUNT
    ? { order, separator }
    : { order: DEFAULT_DATE_ORDER, separator: DEFAULT_DATE_SEPARATOR };
};

const buildEditMask = (info: DateFormatInfo, showCalendar: boolean, showTime: boolean): string => {
  const segments: string[] = [];
  if (showCalendar) segments.push(info.order.map((type) => DATE_PART_TOKENS[type]).join(info.separator));
  if (showTime) segments.push(TIME_MASK);
  return segments.join(DRAFT_SEGMENT_SEPARATOR);
};

const formatEditDraft = (
  date: Date,
  info: DateFormatInfo,
  showCalendar: boolean,
  showTime: boolean,
  timeZone?: string,
): string => {
  const wallClock = readWallClock(date, timeZone);
  const segments: string[] = [];
  if (showCalendar) {
    const tokens: Record<DatePartType, string> = {
      day: padTwo(wallClock.day),
      month: padTwo(wallClock.month),
      year: String(wallClock.year).padStart(YEAR_DIGITS, '0'),
    };
    segments.push(info.order.map((type) => tokens[type]).join(info.separator));
  }
  if (showTime) segments.push(`${padTwo(wallClock.hour)}:${padTwo(wallClock.minute)}`);
  return segments.join(DRAFT_SEGMENT_SEPARATOR);
};

const isCalendarDate = ({ year, month, day }: Record<DatePartType, number>): boolean => {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

const parseEditDraft = (
  raw: string,
  info: DateFormatInfo,
  showCalendar: boolean,
  showTime: boolean,
  base: Date | null,
  timeZone?: string,
): Date | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const patch: Partial<WallClock> = { second: 0, millisecond: 0 };
  let working = trimmed;

  if (showTime) {
    const match = working.match(TIME_DRAFT_PATTERN);
    if (!match || match.index === undefined) return null;
    const hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);
    if (hours > MAX_HOUR || minutes > MAX_MINUTE) return null;
    Object.assign(patch, { hour: hours, minute: minutes });
    working = `${working.slice(0, match.index)} ${working.slice(match.index + match[0].length)}`.trim();
  }

  if (!showCalendar) return resolveWallClock(base, withTodayForInvalidBase(base, patch, timeZone), timeZone);

  const numbers = working.match(DATE_NUMBER_PATTERN);
  if (!numbers || numbers.length < REQUIRED_DATE_PART_COUNT) return null;
  const values: Record<DatePartType, number> = { day: 1, month: 1, year: MONTH_SAMPLE_YEAR };
  info.order.forEach((type, index) => {
    values[type] = Number.parseInt(numbers[index], 10);
  });
  if (values.year < MIN_TYPED_YEAR) return null;
  const candidate = resolveWallClock(base, { ...patch, ...values }, timeZone);
  if (timeZone) return isCalendarDate(values) ? candidate : null;
  const resolved = readWallClock(candidate);
  if (resolved.year !== values.year || resolved.month !== values.month || resolved.day !== values.day) return null;
  return candidate;
};

export interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  mode?: TDateTimePickerMode;
  variant?: DropdownVariant;
  locale?: CalendarProps['locale'];
  displayLocale?: string;
  fromYear?: number;
  toYear?: number;
  disabledDate?: (date: Date) => boolean;
  minuteStep?: number;
  disabled?: boolean;
  placeholder?: string;
  timeSlotLabel?: string;
  clearAriaLabel?: string;
  monthLabel?: string;
  yearLabel?: string;
  hourLabel?: string;
  minuteLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  calendarLabels?: CalendarProps['labels'];
  /**
   * IANA time zone (e.g. `Europe/Berlin`) the value is read and written in. The field, the text draft, the hour and
   * minute segments and the selected calendar day show the value's wall clock in this zone, and every edit resolves to
   * the instant with the edited wall-clock fields there. An ambiguous wall clock keeps the value's current offset when
   * it fits and otherwise resolves to the later instant; a skipped one moves past the jump by the length of the gap.
   * `disabledDate` receives a calendar day as a browser-local midnight whose fields are that day in this zone. Unset,
   * or an id `Intl` rejects, reads and writes the browser's own clock.
   */
  timeZone?: string;
}

interface EditableTimeSegmentProps {
  value: number;
  max: number;
  ariaLabel?: string;
  onCommit: (value: number) => void;
}

const EditableTimeSegment: React.FC<EditableTimeSegmentProps> = ({ value, max, ariaLabel, onCommit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    setDraft(padTwo(value));
    setIsEditing(true);
  }, [value]);

  const commit = useCallback(() => {
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isNaN(parsed)) onCommit(clamp(parsed, max));
    setIsEditing(false);
  }, [draft, max, onCommit]);

  const cancelEditing = useCallback(() => setIsEditing(false), []);

  useEscapeCapture(isEditing, cancelEditing);

  useEffect(() => {
    if (!isEditing) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        className="w-7 rounded-md bg-transparent text-center text-foreground outline-none ring-1 ring-ring"
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, 2))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
        }}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="w-7 rounded-md text-center hover:bg-muted-light"
      onDoubleClick={startEditing}
    >
      {padTwo(value)}
    </button>
  );
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  mode = DATETIME_PICKER_MODES.DATETIME,
  variant = 'default',
  locale,
  displayLocale = 'en',
  fromYear,
  toYear,
  disabledDate,
  minuteStep = DEFAULT_MINUTE_STEP,
  disabled,
  placeholder,
  timeSlotLabel,
  clearAriaLabel,
  monthLabel,
  yearLabel,
  hourLabel,
  minuteLabel,
  previousMonthLabel,
  nextMonthLabel,
  calendarLabels,
  timeZone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const zone = useMemo(() => getUsableTimeZone(timeZone), [timeZone]);
  const [displayMonth, setDisplayMonth] = useState<Date>(() => toDisplayMonth(value, zone));
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [textDraft, setTextDraft] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const clickTimerRef = useRef<number | null>(null);
  const isOpenRef = useRef(isOpen);
  const wasOpenOnTriggerPointerDownRef = useRef(false);
  const sawTriggerPointerDownRef = useRef(false);

  const showCalendar = mode !== DATETIME_PICKER_MODES.TIME;
  const showTime = mode !== DATETIME_PICKER_MODES.DATE;

  const wallClock = useMemo(() => (isValidDate(value) ? readWallClock(value, zone) : undefined), [value, zone]);
  const hours = wallClock?.hour ?? 0;
  const minutes = wallClock?.minute ?? 0;
  const selectedDay = useMemo(() => (isValidDate(value) ? toCalendarDay(value, zone) : undefined), [value, zone]);
  const zoneToday = zone && isOpen ? toCalendarDay(new Date(), zone) : undefined;

  const currentYear = new Date().getFullYear();
  const resolvedFromYear = fromYear ?? currentYear - DEFAULT_YEARS_IN_PAST;
  const resolvedToYear = toYear ?? currentYear + DEFAULT_YEARS_IN_FUTURE;

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(displayLocale, { month: 'long' }), [displayLocale]);

  const monthOptions = useMemo<MonthYearOption[]>(() => buildMonthOptions(monthFormatter), [monthFormatter]);

  const yearOptions = useMemo<MonthYearOption[]>(
    () => buildYearOptions(resolvedFromYear, resolvedToYear),
    [resolvedFromYear, resolvedToYear],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) setDisplayMonth(toDisplayMonth(value, zone));
    },
    [value, zone],
  );

  const emitWallClock = useCallback(
    (patch: Partial<WallClock>) => {
      const base = toValueDate(value);
      onChange(resolveWallClock(base, withTodayForInvalidBase(base, patch, zone), zone));
    },
    [onChange, value, zone],
  );

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange(null);
        return;
      }
      emitWallClock({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
    },
    [emitWallClock, onChange],
  );

  const handleClear = useCallback(() => onChange(null), [onChange]);

  const dateFormatInfo = useMemo(() => getDateFormatInfo(displayLocale), [displayLocale]);
  const editMask = useMemo(
    () => buildEditMask(dateFormatInfo, showCalendar, showTime),
    [dateFormatInfo, showCalendar, showTime],
  );

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(
    () => () => {
      if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isTextEditing) return;
    const input = textInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, [isTextEditing]);

  const clearClickTimer = useCallback(() => {
    if (clickTimerRef.current !== null) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }, []);

  usePopoverOutsideDismiss(anchorRef, () => {
    clearClickTimer();
    const { activeElement } = document;
    if (activeElement instanceof HTMLElement && contentRef.current?.contains(activeElement)) activeElement.blur();
    setIsOpen(false);
  });

  const handleTriggerPointerDown = useCallback(() => {
    sawTriggerPointerDownRef.current = true;
    wasOpenOnTriggerPointerDownRef.current = isOpenRef.current;
  }, []);

  const handleTriggerClick = useCallback(() => {
    if (disabled) return;
    clearClickTimer();
    const wasOpen = sawTriggerPointerDownRef.current ? wasOpenOnTriggerPointerDownRef.current : isOpenRef.current;
    sawTriggerPointerDownRef.current = false;
    clickTimerRef.current = window.setTimeout(() => {
      clickTimerRef.current = null;
      if (wasOpen) {
        setIsOpen(false);
        return;
      }
      setDisplayMonth(toDisplayMonth(value, zone));
      setIsOpen(true);
    }, SINGLE_CLICK_OPEN_DELAY_MS);
  }, [disabled, clearClickTimer, value, zone]);

  const handleTriggerDoubleClick = useCallback(() => {
    if (disabled) return;
    clearClickTimer();
    setIsOpen(false);
    setTextDraft(isValidDate(value) ? formatEditDraft(value, dateFormatInfo, showCalendar, showTime, zone) : '');
    setIsTextEditing(true);
  }, [disabled, clearClickTimer, value, dateFormatInfo, showCalendar, showTime, zone]);

  const commitText = useCallback(() => {
    const parsed = parseEditDraft(textDraft, dateFormatInfo, showCalendar, showTime, toValueDate(value), zone);
    if (parsed) onChange(parsed);
    setIsTextEditing(false);
  }, [textDraft, dateFormatInfo, showCalendar, showTime, value, zone, onChange]);

  const cancelTextEditing = useCallback(() => setIsTextEditing(false), []);

  useEscapeCapture(isTextEditing, cancelTextEditing);

  const onChangeHour = useCallback((hour: number) => emitWallClock({ hour }), [emitWallClock]);

  const onChangeMinute = useCallback((minute: number) => emitWallClock({ minute }), [emitWallClock]);

  const displayYear = displayMonth.getFullYear();
  const displayMonthIndex = displayMonth.getMonth();

  const handlePreviousMonth = useCallback(
    () => setDisplayMonth(new Date(displayYear, displayMonthIndex - 1, 1)),
    [displayYear, displayMonthIndex],
  );

  const handleNextMonth = useCallback(
    () => setDisplayMonth(new Date(displayYear, displayMonthIndex + 1, 1)),
    [displayYear, displayMonthIndex],
  );

  const handleMonthYearSelect = useCallback(
    (year: number, monthIndex: number) => {
      setDisplayMonth(new Date(year, monthIndex, 1));
      if (!isValidDate(value)) return;
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
      const day = Math.min(readWallClock(value, zone).day, lastDayOfMonth);
      const moved = resolveWallClock(value, { year, month: monthIndex + 1, day }, zone);
      if (disabledDate?.(toCalendarDay(moved, zone))) return;
      onChange(moved);
    },
    [value, zone, disabledDate, onChange],
  );

  const triggerText = useMemo(() => {
    if (!value) return placeholder ?? '';
    const dateOptions: Intl.DateTimeFormatOptions =
      mode === DATETIME_PICKER_MODES.TIME ? {} : { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = showTime
      ? { hour: 'numeric', minute: 'numeric', hour12: displayLocale.startsWith('en') }
      : {};
    return new Date(value).toLocaleString(displayLocale, { ...dateOptions, ...timeOptions, timeZone: zone });
  }, [value, placeholder, mode, showTime, displayLocale, zone]);

  const hourValues = useMemo(() => Array.from({ length: HOURS_IN_DAY }, (_, hour) => hour), []);
  const minuteValues = useMemo(
    () => Array.from({ length: Math.ceil(MINUTES_IN_HOUR / minuteStep) }, (_, index) => index * minuteStep),
    [minuteStep],
  );

  const selectedTimeRef = useRef({ hours, minutes, minuteStep });

  useEffect(() => {
    selectedTimeRef.current = { hours, minutes, minuteStep };
  }, [hours, minutes, minuteStep]);

  const timeStripsRef = useRef<HTMLDivElement>(null);

  const attachContent = useCallback((content: HTMLDivElement | null) => {
    contentRef.current = content;
    if (!content || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => {
      const scrollContainer = contentRef.current;
      const strips = timeStripsRef.current;
      if (!scrollContainer || !strips) return;
      const hiddenBelow = getHeightHiddenBelow(scrollContainer, strips);
      if (hiddenBelow <= 0) return;
      scrollContainer.scrollTop += hiddenBelow;
      observer.disconnect();
    });
    observer.observe(content);
    return () => {
      observer.disconnect();
      contentRef.current = null;
    };
  }, []);

  const scrollHourListToSelected = useCallback(
    (list: HTMLDivElement | null) => scrollSelectedIntoView(list, selectedTimeRef.current.hours),
    [],
  );

  const scrollMinuteListToSelected = useCallback((list: HTMLDivElement | null) => {
    const { minutes: selectedMinutes, minuteStep: step } = selectedTimeRef.current;
    scrollSelectedIntoView(list, Math.floor(selectedMinutes / step));
  }, []);

  return (
    <Popover
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <PopoverAnchor asChild>
        {isTextEditing ? (
          <input
            ref={textInputRef}
            type="text"
            aria-label={placeholder}
            placeholder={editMask}
            size={editMask.length}
            disabled={disabled}
            className={cn(
              'my-0 h-10 rounded-lg border border-accent-light bg-transparent px-3 py-0 text-left font-normal text-foreground outline-none ring-1 ring-ring',
            )}
            value={textDraft}
            onChange={(event) => setTextDraft(event.target.value)}
            onBlur={commitText}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitText();
              }
            }}
          />
        ) : (
          <Button
            ref={anchorRef}
            type="button"
            variant="btn-outline"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            onPointerDown={handleTriggerPointerDown}
            onClick={handleTriggerClick}
            onDoubleClick={handleTriggerDoubleClick}
            className={cn(
              'my-0 h-10 w-fit rounded-lg px-3 py-0 text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            {triggerText || placeholder}
            <FontAwesomeIcon
              icon={faXmark}
              aria-label={clearAriaLabel}
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              visibility={value ? 'visible' : 'hidden'}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleClear();
              }}
            />
            <FontAwesomeIcon
              icon={showCalendar ? faCalendarDays : faClock}
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
            />
          </Button>
        )}
      </PopoverAnchor>

      <PopoverContent
        ref={attachContent}
        collisionPadding={POPOVER_COLLISION_PADDING_PX}
        className={cn(
          'liquid-glass-panel max-h-[var(--radix-popover-content-available-height)] w-auto overflow-y-auto rounded-lg p-0 text-foreground',
        )}
      >
        <div className="sm:flex">
          {showCalendar && (
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between gap-1">
                <Button
                  variant="btn-outline"
                  aria-label={previousMonthLabel}
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={handlePreviousMonth}
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="h-4 w-4"
                  />
                </Button>
                <div className="flex min-w-0 flex-1 gap-1">
                  <MonthYearSelect
                    label={monthFormatter.format(displayMonth)}
                    ariaLabel={monthLabel}
                    options={monthOptions}
                    selected={displayMonthIndex}
                    onSelect={(month) => handleMonthYearSelect(displayYear, month)}
                  />
                  <MonthYearSelect
                    label={String(displayYear)}
                    ariaLabel={yearLabel}
                    options={yearOptions}
                    selected={displayYear}
                    onSelect={(year) => handleMonthYearSelect(year, displayMonthIndex)}
                  />
                </div>
                <Button
                  variant="btn-outline"
                  aria-label={nextMonthLabel}
                  className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  onClick={handleNextMonth}
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="h-4 w-4"
                  />
                </Button>
              </div>
              <Calendar
                mode="single"
                month={displayMonth}
                onMonthChange={setDisplayMonth}
                selected={selectedDay}
                today={zoneToday}
                onSelect={handleDateSelect}
                disabled={disabledDate}
                locale={locale}
                className="p-0"
                hideNavigation
                classNames={{ month_caption: 'hidden' }}
                labels={calendarLabels}
              />
            </div>
          )}

          {showTime && (
            <div>
              <div className="m-2 flex h-6 items-center justify-center gap-0.5 text-foreground">
                <EditableTimeSegment
                  value={hours}
                  max={MAX_HOUR}
                  ariaLabel={hourLabel}
                  onCommit={onChangeHour}
                />
                :
                <EditableTimeSegment
                  value={minutes}
                  max={MAX_MINUTE}
                  ariaLabel={minuteLabel}
                  onCommit={onChangeMinute}
                />
                {timeSlotLabel ? <span className="ml-1">{timeSlotLabel}</span> : null}
              </div>
              <div
                ref={timeStripsRef}
                className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0"
              >
                <ScrollArea className="w-64 sm:h-[300px] sm:w-auto">
                  <div
                    ref={scrollHourListToSelected}
                    className="flex p-2 sm:flex-col"
                    onWheel={scrollViewportOnWheel}
                  >
                    {hourValues.map((hour) => (
                      <HourButton
                        key={hour}
                        hour={hour}
                        currentHour={hours}
                        onChangeHour={onChangeHour}
                        variant={variant}
                      />
                    ))}
                  </div>
                </ScrollArea>

                <ScrollArea className="w-64 sm:h-[300px] sm:w-auto">
                  <div
                    ref={scrollMinuteListToSelected}
                    className="flex p-2 sm:flex-col"
                    onWheel={scrollViewportOnWheel}
                  >
                    {minuteValues.map((minute) => (
                      <MinuteButton
                        key={minute}
                        minute={minute}
                        currentMinute={minutes}
                        onChangeMinute={onChangeMinute}
                        variant={variant}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
