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

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef } from 'react';

vi.mock('@radix-ui/react-dialog', () => {
  const Root = ({ children, ...props }: any) => (
    <div
      data-testid="dialog-root"
      {...props}
    >
      {children}
    </div>
  );
  const Trigger = ({ children, ...props }: any) => (
    <button
      type="button"
      data-testid="dialog-trigger"
      {...props}
    >
      {children}
    </button>
  );
  const Close = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      type="button"
      ref={ref}
      data-testid="dialog-close"
      className={className}
      {...props}
    >
      {children}
    </button>
  ));
  Close.displayName = 'DialogClose';
  const Portal = ({ children }: any) => <div data-testid="dialog-portal">{children}</div>;
  const Overlay = React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="dialog-overlay"
      className={className}
      {...props}
    />
  ));
  Overlay.displayName = 'DialogOverlay';
  const Content = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="dialog-content"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = 'DialogContent';
  const Title = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <h2
      ref={ref}
      data-testid="dialog-title"
      className={className}
      {...props}
    >
      {children}
    </h2>
  ));
  Title.displayName = 'DialogTitle';
  const Description = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <p
      ref={ref}
      data-testid="dialog-description"
      className={className}
      {...props}
    >
      {children}
    </p>
  ));
  Description.displayName = 'DialogDescription';
  return { Root, Trigger, Close, Portal, Overlay, Content, Title, Description };
});

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

import { render, screen } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
} from './Dialog';

describe('Dialog', () => {
  it('renders root with children', () => {
    render(
      <Dialog>
        <div>child</div>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Dialog />);
    expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
  });
});

describe('DialogOverlay', () => {
  it('renders with default classes', () => {
    render(
      <Dialog>
        <DialogOverlay />
      </Dialog>,
    );
    const overlay = screen.getByTestId('dialog-overlay');
    expect(overlay.className).toContain('fixed');
    expect(overlay.className).toContain('inset-0');
    expect(overlay.className).toContain('z-50');
  });

  it('merges custom className', () => {
    render(
      <Dialog>
        <DialogOverlay className="custom-overlay" />
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-overlay').className).toContain('custom-overlay');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog>
        <DialogOverlay ref={ref} />
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('DialogContent', () => {
  it('renders children and close button by default', () => {
    render(
      <Dialog>
        <DialogContent>
          <p>Dialog body</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-close')).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Dialog>
        <DialogContent showCloseButton={false}>
          <p>No close</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByTestId('dialog-close')).not.toBeInTheDocument();
  });

  it('renders custom closeLabel', () => {
    render(
      <Dialog>
        <DialogContent closeLabel="Schließen">
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Schließen')).toBeInTheDocument();
  });

  it('renders default closeLabel when not provided', () => {
    render(
      <Dialog>
        <DialogContent>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('applies primary variant classes', () => {
    render(
      <Dialog>
        <DialogContent variant="primary">Content</DialogContent>
      </Dialog>,
    );
    const content = screen.getByTestId('dialog-content');
    expect(content.className).toContain('bg-glass');
    expect(content.className).toContain('backdrop-blur-lg');
  });

  it('applies primary variant overlay classes', () => {
    render(
      <Dialog>
        <DialogContent variant="primary">Content</DialogContent>
      </Dialog>,
    );
    const overlay = screen.getByTestId('dialog-overlay');
    expect(overlay.className).toContain('backdrop-blur-sm');
  });

  it('applies secondary variant classes', () => {
    render(
      <Dialog>
        <DialogContent variant="secondary">Content</DialogContent>
      </Dialog>,
    );
    const content = screen.getByTestId('dialog-content');
    expect(content.className).toContain('color-white');
    expect(content.className).toContain('bg-ciGray');
  });

  it('applies loadingSpinner variant classes', () => {
    render(
      <Dialog>
        <DialogContent variant="loadingSpinner">Content</DialogContent>
      </Dialog>,
    );
    const content = screen.getByTestId('dialog-content');
    expect(content.className).toContain('w-40');
    expect(content.className).toContain('bg-background');
  });

  it('applies default classes without variant', () => {
    render(
      <Dialog>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );
    const content = screen.getByTestId('dialog-content');
    expect(content.className).toContain('rounded-xl');
    expect(content.className).toContain('max-h-[90vh]');
    expect(content.className).toContain('shadow-lg');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Dialog>
        <DialogContent ref={ref}>Content</DialogContent>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(
      <Dialog>
        <DialogContent className="custom-dialog">Content</DialogContent>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-content').className).toContain('custom-dialog');
  });

  it('renders portal and overlay', () => {
    render(
      <Dialog>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-portal')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
  });

  it('cleans up pointerEvents on unmount', () => {
    document.body.style.pointerEvents = 'none';
    const { unmount } = render(
      <Dialog>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );
    unmount();
    expect(document.body.style.pointerEvents).toBe('');
  });

  it('resets pointerEvents on overlay animationend', () => {
    document.body.style.pointerEvents = 'none';
    render(
      <Dialog>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );
    const overlay = screen.getByTestId('dialog-overlay');
    overlay.dispatchEvent(new Event('animationend', { bubbles: false }));
    expect(document.body.style.pointerEvents).toBe('');
  });
});

describe('DialogHeader', () => {
  it('renders with children', () => {
    render(<DialogHeader>Header text</DialogHeader>);
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<DialogHeader className="custom-header">Header</DialogHeader>);
    expect(container.firstChild).toHaveClass('custom-header');
  });

  it('applies default classes', () => {
    const { container } = render(<DialogHeader>Header</DialogHeader>);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('flex-col');
  });
});

describe('DialogFooter', () => {
  it('renders with children', () => {
    render(<DialogFooter>Footer text</DialogFooter>);
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<DialogFooter className="custom-footer">Footer</DialogFooter>);
    expect(container.firstChild).toHaveClass('custom-footer');
  });

  it('applies default classes', () => {
    const { container } = render(<DialogFooter>Footer</DialogFooter>);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('flex-col-reverse');
  });
});

describe('DialogTitle', () => {
  it('renders with children and forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Dialog>
        <DialogTitle ref={ref}>Title</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('merges custom className', () => {
    render(
      <Dialog>
        <DialogTitle className="custom-title">Title</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-title').className).toContain('custom-title');
  });

  it('applies default classes', () => {
    render(
      <Dialog>
        <DialogTitle>Title</DialogTitle>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-title').className).toContain('rounded-xl');
    expect(screen.getByTestId('dialog-title').className).toContain('text-lg');
    expect(screen.getByTestId('dialog-title').className).toContain('font-semibold');
  });
});

describe('DialogDescription', () => {
  it('renders with sr-only class', () => {
    render(
      <Dialog>
        <DialogDescription>Description</DialogDescription>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-description').className).toContain('sr-only');
  });

  it('merges custom className', () => {
    render(
      <Dialog>
        <DialogDescription className="custom-desc">Description</DialogDescription>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-description').className).toContain('custom-desc');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Dialog>
        <DialogDescription ref={ref}>Description</DialogDescription>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('DialogTrigger', () => {
  it('renders trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});

describe('DialogClose', () => {
  it('renders close button', () => {
    render(
      <Dialog>
        <DialogClose>Close me</DialogClose>
      </Dialog>,
    );
    expect(screen.getByText('Close me')).toBeInTheDocument();
  });
});
