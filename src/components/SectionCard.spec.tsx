/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SectionCard from './SectionCard';

describe('SectionCard', () => {
  it('renders children inside the body', () => {
    render(
      <SectionCard>
        <span data-testid="single-body">single body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('single-body')).toBeInTheDocument();
  });

  it('renders the header label as an h3 when label is a string', () => {
    render(
      <SectionCard label="Section title">
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Section title' })).toBeInTheDocument();
  });

  it('uses the provided header node when both header and label are passed', () => {
    render(
      <SectionCard
        label="ignored"
        header={<div data-testid="custom-header">custom header</div>}
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'ignored' })).toBeNull();
  });

  it('applies the liquid-glass surface for the default variant and drops it for transparent', () => {
    const { rerender } = render(
      <SectionCard surfaceId="surface">
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveClass('liquid-glass');

    rerender(
      <SectionCard
        surfaceId="surface"
        variant="transparent"
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).not.toHaveClass('liquid-glass');
  });

  it('forwards onClick to the surface so the whole card is clickable', () => {
    const onClick = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={onClick}
      >
        <span>body</span>
      </SectionCard>,
    );

    fireEvent.click(document.getElementById('surface') as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('makes a clickable card focusable and leaves a non-clickable one out of the tab order', () => {
    const { rerender } = render(
      <SectionCard
        surfaceId="surface"
        onClick={vi.fn()}
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveAttribute('tabindex', '0');

    rerender(
      <SectionCard surfaceId="surface">
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).not.toHaveAttribute('tabindex');
  });

  it('activates a clickable card with Enter and with Space', () => {
    const onClick = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={onClick}
      >
        <span>body</span>
      </SectionCard>,
    );

    const surface = document.getElementById('surface') as HTMLElement;

    fireEvent.keyDown(surface, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(surface, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(surface, { key: 'a' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('prevents the default Space scroll when it activates the card', () => {
    render(
      <SectionCard
        surfaceId="surface"
        onClick={vi.fn()}
      >
        <span>body</span>
      </SectionCard>,
    );

    const isNotCancelled = fireEvent.keyDown(document.getElementById('surface') as HTMLElement, { key: ' ' });

    expect(isNotCancelled).toBe(false);
  });

  it('ignores Enter pressed on a control inside the card', () => {
    const onClick = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={onClick}
      >
        <button type="button">inner</button>
      </SectionCard>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'inner' }), { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('still calls a caller-supplied onKeyDown', () => {
    const onKeyDown = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={vi.fn()}
        onKeyDown={onKeyDown}
      >
        <span>body</span>
      </SectionCard>,
    );

    fireEvent.keyDown(document.getElementById('surface') as HTMLElement, { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('leaves the card unactivated when a caller-supplied onKeyDown prevents the default', () => {
    const onClick = vi.fn();
    render(
      <SectionCard
        surfaceId="surface"
        onClick={onClick}
        onKeyDown={(event) => event.preventDefault()}
      >
        <span>body</span>
      </SectionCard>,
    );

    fireEvent.keyDown(document.getElementById('surface') as HTMLElement, { key: 'Enter' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('keeps a caller-supplied tabIndex on a clickable card', () => {
    render(
      <SectionCard
        surfaceId="surface"
        onClick={vi.fn()}
        tabIndex={-1}
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveAttribute('tabindex', '-1');
  });

  it('paints the pointer cursor on a clickable card only', () => {
    const { rerender } = render(
      <SectionCard
        surfaceId="surface"
        onClick={vi.fn()}
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveClass('cursor-pointer');

    rerender(
      <SectionCard surfaceId="surface">
        <span>body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).not.toHaveClass('cursor-pointer');
  });

  it('puts className on the surface and bodyClassName on the body element', () => {
    render(
      <SectionCard
        surfaceId="surface"
        className="h-full min-h-0 overflow-hidden"
        bodyClassName="flex h-full min-h-0 flex-col"
      >
        <span data-testid="body-child">body</span>
      </SectionCard>,
    );

    expect(document.getElementById('surface')).toHaveClass('h-full', 'min-h-0', 'overflow-hidden');
    expect(screen.getByTestId('body-child').parentElement).toHaveClass('flex', 'h-full', 'min-h-0', 'flex-col');
  });

  it('extends the label header with headerClassName but leaves a custom header node unstyled', () => {
    const { rerender } = render(
      <SectionCard
        label="Section title"
        headerClassName="header-extra"
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Section title' }).parentElement).toHaveClass('header-extra');

    rerender(
      <SectionCard
        header={<div data-testid="custom-header">custom header</div>}
        headerClassName="header-extra"
      >
        <span>body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('custom-header')).not.toHaveClass('header-extra');
    expect(document.querySelector('.header-extra')).toBeNull();
  });

  it('resolves padding="compact" to the compact body spacing', () => {
    render(
      <SectionCard padding="compact">
        <span data-testid="body-child">body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('body-child').parentElement).toHaveClass('px-4', 'pb-4', 'pt-4');
  });

  it('resolves the default padding to the default body spacing', () => {
    render(
      <SectionCard>
        <span data-testid="body-child">body</span>
      </SectionCard>,
    );

    expect(screen.getByTestId('body-child').parentElement).toHaveClass('px-6', 'pb-6', 'pt-6');
  });

  it('drops the body top padding when a header takes over the top spacing', () => {
    render(
      <SectionCard
        label="Section title"
        padding="compact"
      >
        <span data-testid="body-child">body</span>
      </SectionCard>,
    );

    const body = screen.getByTestId('body-child').parentElement;

    expect(body).toHaveClass('px-4', 'pb-4', 'pt-0');
    expect(body).not.toHaveClass('pt-4');
  });
});
