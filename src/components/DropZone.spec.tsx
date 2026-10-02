/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, no-underscore-dangle */

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ className }: any) => (
    <span
      data-testid="fa-icon"
      className={className}
    />
  ),
}));

vi.mock('react-dropzone', () => ({
  useDropzone: (options: any) => ({
    getRootProps: (extra: any) => ({
      ...extra,
      'data-testid': 'dropzone-root',
      onClick: vi.fn(),
    }),
    getInputProps: () => ({
      'data-testid': 'dropzone-input',
    }),
    isDragActive: options._isDragActive ?? false,
  }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import DropZone from './DropZone';

describe('DropZone', () => {
  it('renders the dropzone root', () => {
    render(
      <DropZone
        onDrop={vi.fn()}
        dragActiveText="Drop here"
        inactiveText="Drag and drop"
      />,
    );
    expect(screen.getByTestId('dropzone-root')).toBeInTheDocument();
  });

  it('renders the hidden file input', () => {
    render(
      <DropZone
        onDrop={vi.fn()}
        dragActiveText="Drop here"
        inactiveText="Drag and drop"
      />,
    );
    expect(screen.getByTestId('dropzone-input')).toBeInTheDocument();
  });

  it('renders the upload icon', () => {
    render(
      <DropZone
        onDrop={vi.fn()}
        dragActiveText="Drop here"
        inactiveText="Drag and drop"
      />,
    );
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('shows inactive text', () => {
    render(
      <DropZone
        onDrop={vi.fn()}
        dragActiveText="Drop here"
        inactiveText="Upload your files"
      />,
    );
    expect(screen.getByText('Upload your files')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DropZone
        onDrop={vi.fn()}
        dragActiveText="Drop here"
        inactiveText="Drag and drop"
        className="custom-drop"
      />,
    );
    const root = screen.getByTestId('dropzone-root');
    expect(root.className).toContain('custom-drop');
  });
});
