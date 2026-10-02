/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-use-before-define, jsx-a11y/label-has-associated-control, jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-has-required-aria-props, react/button-has-type, react/display-name, react/no-array-index-key, no-underscore-dangle, no-plusplus */

import React from 'react';
import { render, screen } from '@testing-library/react';
import WarningBox from './WarningBox';

const defaultProps = {
  title: 'Warning Title',
  description: 'Warning description text',
  filenames: ['file1.txt', 'file2.txt'],
  borderColor: 'border-red-500',
  backgroundColor: 'bg-red-50',
  textColor: 'text-red-800',
};

describe('WarningBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, description, and filenames inline', () => {
    render(<WarningBox {...defaultProps} />);

    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Warning description text')).toBeInTheDocument();
    expect(screen.getByText('file1.txt, file2.txt')).toBeInTheDocument();
  });

  it('renders no heading when the title is omitted, so a dialog title is not repeated above the description', () => {
    const { container } = render(
      <WarningBox
        description="Warning description text"
        variant="info"
      />,
    );

    expect(screen.getByText('Warning description text')).toBeInTheDocument();
    expect(container.querySelector('.font-bold')).toBeNull();
  });

  it('renders without file list when filenames is empty', () => {
    render(
      <WarningBox
        {...defaultProps}
        filenames={[]}
      />,
    );

    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Warning description text')).toBeInTheDocument();
    expect(screen.queryByText(/file1\.txt/)).not.toBeInTheDocument();
  });

  it('renders without file list when filenames is omitted', () => {
    const { filenames, ...propsWithoutFilenames } = defaultProps;
    render(<WarningBox {...propsWithoutFilenames} />);

    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.queryByText(/file1\.txt/)).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <WarningBox
        {...defaultProps}
        icon={<span data-testid="warning-icon">!</span>}
      />,
    );

    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
  });

  it('does not render icon container when icon is not provided', () => {
    const { container } = render(<WarningBox {...defaultProps} />);

    expect(container.querySelector('.mb-2')).not.toBeInTheDocument();
  });

  it('applies color classes from props', () => {
    const { container } = render(<WarningBox {...defaultProps} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-red-500');
    expect(wrapper.className).toContain('bg-red-50');
    expect(wrapper.className).toContain('text-red-800');
  });

  it('applies variant error classes when variant is error', () => {
    const { container } = render(
      <WarningBox
        title="Error"
        description="Something went wrong"
        variant="error"
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-colorDanger');
    expect(wrapper.className).toContain('bg-colorDanger/10');
    expect(wrapper.className).toContain('text-colorDanger dark:text-colorDangerLight');
  });

  it('applies variant warning classes when variant is warning', () => {
    const { container } = render(
      <WarningBox
        title="Warning"
        description="Watch out"
        variant="warning"
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-colorWarningLight');
    expect(wrapper.className).toContain('bg-colorWarningLight/10');
  });

  it('explicit color props override variant defaults', () => {
    const { container } = render(
      <WarningBox
        title="Custom"
        description="Custom styled"
        variant="error"
        borderColor="border-border"
        backgroundColor="bg-glass"
        textColor="text-foreground"
      />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('border-border');
    expect(wrapper.className).toContain('bg-glass');
    expect(wrapper.className).toContain('text-foreground');
    expect(wrapper.className).not.toContain('border-colorDanger');
  });

  it('renders all filenames joined by commas without line breaks per name', () => {
    const filenames = ['a.txt', 'b.txt', 'c.txt'];
    render(
      <WarningBox
        {...defaultProps}
        filenames={filenames}
      />,
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByText('a.txt, b.txt, c.txt')).toBeInTheDocument();
  });

  it('lays title and description on one row without the bottom margin when inline, so it fits a toolbar', () => {
    const { container } = render(
      <WarningBox
        layout="inline"
        variant="warning"
        title="3 without a seat"
        description="20 seats · 23 pupils"
      />,
    );

    const box = container.firstElementChild as HTMLElement;
    expect(box.className).toContain('flex-row');
    expect(box.className).not.toContain('mb-4');
    expect(box.className).not.toContain('flex-col');
    expect(box).toHaveTextContent('3 without a seat');
    expect(box).toHaveTextContent('20 seats · 23 pupils');
  });

  it('keeps the block layout when no layout is given, so existing boxes do not change', () => {
    const { container } = render(
      <WarningBox
        variant="warning"
        title="t"
        description="d"
      />,
    );

    expect((container.firstElementChild as HTMLElement).className).toContain('flex-col');
  });
});
