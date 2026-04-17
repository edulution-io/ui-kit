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
      data-testid="sheet-root"
      {...props}
    >
      {children}
    </div>
  );
  const Trigger = ({ children, ...props }: any) => (
    <button
      type="button"
      data-testid="sheet-trigger"
      {...props}
    >
      {children}
    </button>
  );
  const Close = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      type="button"
      ref={ref}
      data-testid="sheet-close"
      className={className}
      {...props}
    >
      {children}
    </button>
  ));
  Close.displayName = 'DialogClose';
  const Portal = ({ children }: any) => <div data-testid="sheet-portal">{children}</div>;
  const Overlay = React.forwardRef(({ className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="sheet-overlay"
      className={className}
      {...props}
    />
  ));
  Overlay.displayName = 'DialogOverlay';
  const Content = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="sheet-content"
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
      data-testid="sheet-title"
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
      data-testid="sheet-description"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
  SheetOverlay,
} from './Sheet';

describe('Sheet', () => {
  it('renders root with children', () => {
    render(
      <Sheet>
        <div>child</div>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-root')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Sheet />);
    expect(screen.getByTestId('sheet-root')).toBeInTheDocument();
  });
});

describe('SheetOverlay', () => {
  it('renders with default classes', () => {
    render(
      <Sheet>
        <SheetOverlay />
      </Sheet>,
    );
    const overlay = screen.getByTestId('sheet-overlay');
    expect(overlay.className).toContain('fixed');
    expect(overlay.className).toContain('inset-0');
    expect(overlay.className).toContain('z-50');
  });

  it('merges custom className', () => {
    render(
      <Sheet>
        <SheetOverlay className="custom-overlay" />
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-overlay').className).toContain('custom-overlay');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Sheet>
        <SheetOverlay ref={ref} />
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('SheetContent', () => {
  it('renders children and close button by default', () => {
    render(
      <Sheet>
        <SheetContent>
          <p>Panel content</p>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText('Panel content')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-close')).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Sheet>
        <SheetContent showCloseButton={false}>
          <p>No close</p>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.queryByTestId('sheet-close')).not.toBeInTheDocument();
  });

  it('renders custom closeLabel', () => {
    render(
      <Sheet>
        <SheetContent closeLabel="Schließen">
          <p>Content</p>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText('Schließen')).toBeInTheDocument();
  });

  it('renders default closeLabel when not provided', () => {
    render(
      <Sheet>
        <SheetContent>
          <p>Content</p>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('applies primary variant classes', () => {
    render(
      <Sheet>
        <SheetContent variant="primary">Content</SheetContent>
      </Sheet>,
    );
    const content = screen.getByTestId('sheet-content');
    expect(content.className).toContain('text-foreground');
    expect(content.className).toContain('bg-glass');
    expect(content.className).toContain('backdrop-blur-lg');
  });

  it('applies secondary variant classes', () => {
    render(
      <Sheet>
        <SheetContent variant="secondary">Content</SheetContent>
      </Sheet>,
    );
    const content = screen.getByTestId('sheet-content');
    expect(content.className).toContain('text-background');
    expect(content.className).toContain('bg-ciGray');
  });

  it('applies close button styling for primary variant', () => {
    render(
      <Sheet>
        <SheetContent variant="primary">Content</SheetContent>
      </Sheet>,
    );
    const closeBtn = screen.getByTestId('sheet-close');
    expect(closeBtn.className).toContain('text-card-foreground');
  });

  it('applies close button styling for secondary variant', () => {
    render(
      <Sheet>
        <SheetContent variant="secondary">Content</SheetContent>
      </Sheet>,
    );
    const closeBtn = screen.getByTestId('sheet-close');
    expect(closeBtn.className).toContain('text-foreground');
  });

  it('applies side=top classes', () => {
    render(
      <Sheet>
        <SheetContent side="top">Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-content').className).toContain('inset-x-0');
    expect(screen.getByTestId('sheet-content').className).toContain('top-0');
  });

  it('applies side=bottom classes', () => {
    render(
      <Sheet>
        <SheetContent side="bottom">Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-content').className).toContain('bottom-0');
  });

  it('applies side=left classes', () => {
    render(
      <Sheet>
        <SheetContent side="left">Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-content').className).toContain('left-0');
  });

  it('applies default side=right classes', () => {
    render(
      <Sheet>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-content').className).toContain('right-0');
  });

  it('passes overlayClassName to SheetOverlay', () => {
    render(
      <Sheet>
        <SheetContent overlayClassName="custom-overlay">Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-overlay').className).toContain('custom-overlay');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Sheet>
        <SheetContent ref={ref}>Content</SheetContent>
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    render(
      <Sheet>
        <SheetContent className="custom-sheet">Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-content').className).toContain('custom-sheet');
  });

  it('renders portal and overlay', () => {
    render(
      <Sheet>
        <SheetContent>Content</SheetContent>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-portal')).toBeInTheDocument();
    expect(screen.getByTestId('sheet-overlay')).toBeInTheDocument();
  });
});

describe('SheetHeader', () => {
  it('renders with children', () => {
    render(<SheetHeader>Header text</SheetHeader>);
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<SheetHeader className="custom-header">Header</SheetHeader>);
    expect(container.firstChild).toHaveClass('custom-header');
  });

  it('applies default classes', () => {
    const { container } = render(<SheetHeader>Header</SheetHeader>);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies primary variant classes', () => {
    const { container } = render(<SheetHeader variant="primary">Header</SheetHeader>);
    expect((container.firstChild as HTMLElement).className).toContain('text-foreground');
  });

  it('applies secondary variant classes', () => {
    const { container } = render(<SheetHeader variant="secondary">Header</SheetHeader>);
    expect((container.firstChild as HTMLElement).className).toContain('text-background');
  });

  it('renders without variant', () => {
    const { container } = render(<SheetHeader>Header</SheetHeader>);
    expect((container.firstChild as HTMLElement).className).not.toContain('color-black');
    expect((container.firstChild as HTMLElement).className).not.toContain('color-white');
  });
});

describe('SheetFooter', () => {
  it('renders with children', () => {
    render(<SheetFooter>Footer text</SheetFooter>);
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<SheetFooter className="custom-footer">Footer</SheetFooter>);
    expect(container.firstChild).toHaveClass('custom-footer');
  });

  it('applies default classes', () => {
    const { container } = render(<SheetFooter>Footer</SheetFooter>);
    expect(container.firstChild).toHaveClass('mt-8');
    expect(container.firstChild).toHaveClass('flex');
  });
});

describe('SheetTitle', () => {
  it('renders with children and forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Sheet>
        <SheetTitle ref={ref}>Title</SheetTitle>
      </Sheet>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('merges custom className', () => {
    render(
      <Sheet>
        <SheetTitle className="custom-title">Title</SheetTitle>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-title').className).toContain('custom-title');
  });

  it('applies default classes', () => {
    render(
      <Sheet>
        <SheetTitle>Title</SheetTitle>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-title').className).toContain('text-center');
    expect(screen.getByTestId('sheet-title').className).toContain('text-lg');
    expect(screen.getByTestId('sheet-title').className).toContain('font-semibold');
  });
});

describe('SheetDescription', () => {
  it('renders with sr-only class', () => {
    render(
      <Sheet>
        <SheetDescription>Description</SheetDescription>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-description').className).toContain('sr-only');
  });

  it('merges custom className', () => {
    render(
      <Sheet>
        <SheetDescription className="custom-desc">Description</SheetDescription>
      </Sheet>,
    );
    expect(screen.getByTestId('sheet-description').className).toContain('custom-desc');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLParagraphElement>();
    render(
      <Sheet>
        <SheetDescription ref={ref}>Description</SheetDescription>
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('SheetTrigger', () => {
  it('renders trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});

describe('SheetClose', () => {
  it('renders close button', () => {
    render(
      <Sheet>
        <SheetClose>Close me</SheetClose>
      </Sheet>,
    );
    expect(screen.getByText('Close me')).toBeInTheDocument();
  });
});
