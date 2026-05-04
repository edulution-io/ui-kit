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

/* eslint-disable @typescript-eslint/no-explicit-any, react/button-has-type, react/display-name */

import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from './CardList';
import type { CardListItemProps } from './CardList';

vi.mock('./Checkbox', () => ({
  default: ({ checked, onCheckedChange }: any) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked ? 'true' : 'false'}
      data-testid="select-all-checkbox"
      onClick={() => onCheckedChange?.(!checked)}
    />
  ),
}));

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => (
    <i
      data-testid="fa-icon"
      data-icon={(icon && icon.iconName) || 'unknown'}
    />
  ),
}));

interface Item {
  id: number;
  label: string;
}

const observers: Array<{
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

const triggerIntersection = (isIntersecting: boolean) => {
  observers.forEach(({ callback, observe }) => {
    const target = (observe.mock.calls[0]?.[0] ?? null) as Element;
    callback([{ isIntersecting, target } as IntersectionObserverEntry], {} as IntersectionObserver);
  });
};

beforeEach(() => {
  observers.length = 0;
  class MockIO {
    callback: IntersectionObserverCallback;

    observe = vi.fn();

    disconnect = vi.fn();

    unobserve = vi.fn();

    takeRecords = vi.fn(() => []);

    root = null;

    rootMargin = '';

    thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      observers.push({ callback: this.callback, observe: this.observe, disconnect: this.disconnect });
    }
  }
  (window as any).IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  (globalThis as any).IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
});

const renderItem = ({ item, isActive, isChecked, onCheckboxChange }: CardListItemProps<Item>) => (
  <div
    key={item.id}
    data-testid={`item-${item.id}`}
    data-active={isActive ? 'true' : 'false'}
    data-checked={isChecked ? 'true' : 'false'}
  >
    <span>{item.label}</span>
    <button
      type="button"
      data-testid={`item-toggle-${item.id}`}
      onClick={onCheckboxChange}
    >
      toggle
    </button>
  </div>
);

const items: Item[] = [
  { id: 1, label: 'Alpha' },
  { id: 2, label: 'Beta' },
  { id: 3, label: 'Gamma' },
];

describe('CardList', () => {
  it('renders each item via renderItem', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />,
    );

    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
  });

  it('renders nothing in the list when items is empty and emptyMessage is omitted', () => {
    render(
      <CardList<Item>
        items={[]}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />,
    );

    expect(screen.queryByTestId(/^item-/)).toBeNull();
  });

  it('shows emptyMessage when items is empty and not loading', () => {
    render(
      <CardList<Item>
        items={[]}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        emptyMessage="No items here"
      />,
    );

    expect(screen.getByText('No items here')).toBeInTheDocument();
  });

  it('hides emptyMessage when isLoading is true', () => {
    render(
      <CardList<Item>
        items={[]}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        emptyMessage="No items here"
        loadingMessage="Loading..."
        isLoading
      />,
    );

    expect(screen.queryByText('No items here')).toBeNull();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not show emptyMessage when items are present', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        emptyMessage="No items here"
      />,
    );

    expect(screen.queryByText('No items here')).toBeNull();
  });

  it('renders header title, subtitle, and actions when provided', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        header={{
          title: 'INBOX',
          subtitle: '3 messages',
          actions: <span data-testid="header-action">action</span>,
        }}
      />,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('INBOX');
    expect(screen.getByText('3 messages')).toBeInTheDocument();
    expect(screen.getByTestId('header-action')).toBeInTheDocument();
  });

  it('omits header entirely when header prop is undefined', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />,
    );

    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('renders header without optional fields', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        header={{ title: 'OnlyTitle' }}
      />,
    );

    expect(screen.getByText('OnlyTitle')).toBeInTheDocument();
  });

  it('does not render search input when onSearch is not provided', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        searchPlaceholder="Search"
      />,
    );

    expect(screen.queryByPlaceholderText('Search')).toBeNull();
  });

  it('debounces onSearch callback', () => {
    vi.useFakeTimers();
    try {
      const onSearch = vi.fn();
      render(
        <CardList<Item>
          items={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          onSearch={onSearch}
          searchPlaceholder="Search"
          searchDebounceMs={300}
        />,
      );

      const input = screen.getByPlaceholderText('Search');

      act(() => {
        input.focus();
      });
      act(() => {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(input, 'a');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      act(() => {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(input, 'ab');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      act(() => {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(input, 'abc');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenLastCalledWith('abc');
    } finally {
      vi.useRealTimers();
    }
  });

  it('uses default 500ms debounce when searchDebounceMs is omitted', () => {
    vi.useFakeTimers();
    try {
      const onSearch = vi.fn();
      render(
        <CardList<Item>
          items={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          onSearch={onSearch}
          searchPlaceholder="Search"
        />,
      );

      const input = screen.getByPlaceholderText('Search');
      act(() => {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(input, 'q');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onSearch).toHaveBeenCalledWith('q');
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears search via clear button and immediately calls onSearch with empty string', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onSearch={onSearch}
        searchPlaceholder="Search"
        searchDebounceMs={0}
      />,
    );

    const input = screen.getByPlaceholderText('Search');
    await user.type(input, 'hello');

    const clearButton = input.parentElement!.querySelector('button[type="button"]') as HTMLElement;
    expect(clearButton).toBeTruthy();

    onSearch.mockClear();
    await user.click(clearButton);

    expect(onSearch).toHaveBeenCalledWith('');
    expect(input.value).toBe('');
  });

  it('passes activeItemKey through to renderItem as isActive', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        activeItemKey={2}
      />,
    );

    expect(screen.getByTestId('item-1')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-3')).toHaveAttribute('data-active', 'false');
  });

  it('treats null activeItemKey as no active item', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        activeItemKey={null}
      />,
    );

    items.forEach(({ id }) => {
      expect(screen.getByTestId(`item-${id}`)).toHaveAttribute('data-active', 'false');
    });
  });

  it('passes checkedItemKeys through to renderItem as isChecked', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1, 3]}
      />,
    );

    expect(screen.getByTestId('item-1')).toHaveAttribute('data-checked', 'true');
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-checked', 'false');
    expect(screen.getByTestId('item-3')).toHaveAttribute('data-checked', 'true');
  });

  it('invokes onItemCheckChange when renderItem fires onCheckboxChange', async () => {
    const user = userEvent.setup();
    const onItemCheckChange = vi.fn();

    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onItemCheckChange={onItemCheckChange}
      />,
    );

    await user.click(screen.getByTestId('item-toggle-2'));
    expect(onItemCheckChange).toHaveBeenCalledWith(2);
  });

  it('does not throw when onItemCheckChange is omitted', async () => {
    const user = userEvent.setup();
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />,
    );

    await expect(user.click(screen.getByTestId('item-toggle-1'))).resolves.not.toThrow();
  });

  it('shows bulk action bar with zero count when no items are checked', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        bulkActions={<span data-testid="bulk">bulk</span>}
        onSelectAll={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByTestId('bulk')).toBeInTheDocument();
    expect(screen.getByTestId('select-all-checkbox')).toBeInTheDocument();
    expect(screen.getByText('0 selected')).toBeInTheDocument();
  });

  it('omits bulk action bar entirely when neither bulkActions nor onSelectAll is provided', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1]}
      />,
    );

    expect(screen.queryByTestId('select-all-checkbox')).toBeNull();
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it('shows bulk action bar with select-all checkbox when items are checked', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1]}
        bulkActions={<span data-testid="bulk">bulk</span>}
        onSelectAll={vi.fn()}
        onClearSelection={vi.fn()}
      />,
    );

    expect(screen.getByTestId('bulk')).toBeInTheDocument();
    expect(screen.getByTestId('select-all-checkbox')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('shows bulk action bar with bulkActions even when neither onSelectAll nor onClearSelection is provided', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1]}
        bulkActions={<span data-testid="bulk">bulk</span>}
      />,
    );

    expect(screen.getByTestId('bulk')).toBeInTheDocument();
    expect(screen.queryByTestId('select-all-checkbox')).toBeNull();
  });

  it('uses selectionLabel to format the selection counter', () => {
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1, 2]}
        onSelectAll={vi.fn()}
        selectionLabel={(count) => `${count} ausgewählt`}
      />,
    );

    expect(screen.getByText('2 ausgewählt')).toBeInTheDocument();
  });

  it('calls onSelectAll when checkbox clicked and not all are checked', async () => {
    const user = userEvent.setup();
    const onSelectAll = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1]}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />,
    );

    await user.click(screen.getByTestId('select-all-checkbox'));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
    expect(onClearSelection).not.toHaveBeenCalled();
  });

  it('calls onClearSelection when checkbox clicked and all are checked', async () => {
    const user = userEvent.setup();
    const onSelectAll = vi.fn();
    const onClearSelection = vi.fn();

    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[1, 2, 3]}
        onSelectAll={onSelectAll}
        onClearSelection={onClearSelection}
      />,
    );

    await user.click(screen.getByTestId('select-all-checkbox'));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
    expect(onSelectAll).not.toHaveBeenCalled();
  });

  it('does not consider list "all checked" when items array is empty', () => {
    render(
      <CardList<Item>
        items={[]}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        checkedItemKeys={[]}
        onSelectAll={vi.fn()}
      />,
    );

    expect(screen.getByTestId('select-all-checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('does not render the infinite-scroll sentinel when onLoadMore is omitted', () => {
    const { container } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        hasMore
      />,
    );

    expect(container.querySelector('div.h-1')).toBeNull();
  });

  it('does not render the infinite-scroll sentinel when hasMore is false', () => {
    const { container } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onLoadMore={vi.fn()}
        hasMore={false}
      />,
    );

    expect(container.querySelector('div.h-1')).toBeNull();
  });

  it('calls onLoadMore when sentinel intersects', () => {
    const onLoadMore = vi.fn();
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onLoadMore={onLoadMore}
        hasMore
      />,
    );

    expect(observers).toHaveLength(1);
    act(() => triggerIntersection(true));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('does not call onLoadMore when intersection fires while isLoading', () => {
    const onLoadMore = vi.fn();
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onLoadMore={onLoadMore}
        hasMore
        isLoading
      />,
    );

    act(() => triggerIntersection(true));
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not call onLoadMore when entry is not intersecting', () => {
    const onLoadMore = vi.fn();
    render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onLoadMore={onLoadMore}
        hasMore
      />,
    );

    act(() => triggerIntersection(false));
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('disconnects the IntersectionObserver on unmount', () => {
    const { unmount } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        onLoadMore={vi.fn()}
        hasMore
      />,
    );

    expect(observers).toHaveLength(1);
    const observer = observers[0];
    unmount();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('applies the className prop to the root container', () => {
    const { container } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        className="my-custom-root"
      />,
    );

    expect(container.firstChild).toHaveClass('my-custom-root');
  });

  it('applies the scrollClassName prop to the scroll container', () => {
    const { container } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        scrollClassName="my-scroll"
      />,
    );

    const scrollContainer = container.querySelector('.scrollbar-thin');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.className).toContain('my-scroll');
    expect(scrollContainer?.className).toContain('overflow-auto');
  });

  it('renders the scroll container with overflow-auto and scrollbar-thin', () => {
    const { container } = render(
      <CardList<Item>
        items={items}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />,
    );

    const scrollContainer = container.querySelector('.scrollbar-thin');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer?.className).toContain('overflow-auto');
  });

  it('uses string keys via keyExtractor', () => {
    interface StringItem {
      slug: string;
      label: string;
    }
    const stringItems: StringItem[] = [
      { slug: 'a', label: 'A' },
      { slug: 'b', label: 'B' },
    ];

    render(
      <CardList<StringItem>
        items={stringItems}
        keyExtractor={(i) => i.slug}
        activeItemKey="b"
        renderItem={({ item, isActive }) => (
          <div
            data-testid={`s-${item.slug}`}
            data-active={isActive ? 'true' : 'false'}
          >
            {item.label}
          </div>
        )}
      />,
    );

    expect(screen.getByTestId('s-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('s-b')).toHaveAttribute('data-active', 'true');
  });
});
