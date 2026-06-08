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
});
