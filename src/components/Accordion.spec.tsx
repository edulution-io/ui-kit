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

vi.mock('@radix-ui/react-accordion', () => {
  const Root = ({ children, ...props }: any) => (
    <div
      data-testid="accordion-root"
      {...props}
    >
      {children}
    </div>
  );
  const Item = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="accordion-item"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Item.displayName = 'AccordionItem';
  const Header = ({ children, className }: any) => (
    <div
      data-testid="accordion-header"
      className={className}
    >
      {children}
    </div>
  );
  const Trigger = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <button
      ref={ref}
      type="button"
      data-testid="accordion-trigger"
      className={className}
      {...props}
    >
      {children}
    </button>
  ));
  Trigger.displayName = 'AccordionTrigger';
  const Content = React.forwardRef(({ children, className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      data-testid="accordion-content"
      className={className}
      {...props}
    >
      {children}
    </div>
  ));
  Content.displayName = 'AccordionContent';
  return { Root, Item, Header, Trigger, Content };
});

vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

describe('Accordion', () => {
  it('renders root with children', () => {
    render(
      <Accordion>
        <div>child</div>
      </Accordion>,
    );
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Accordion />);
    expect(screen.getByTestId('accordion-root')).toBeInTheDocument();
  });
});

describe('AccordionItem', () => {
  it('merges custom className with defaults', () => {
    render(
      <Accordion>
        <AccordionItem
          value="item-1"
          className="custom-item"
        >
          content
        </AccordionItem>
      </Accordion>,
    );
    const item = screen.getByTestId('accordion-item');
    expect(item.className).toContain('no-border');
    expect(item.className).toContain('custom-item');
  });

  it('forwards ref to the item element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Accordion>
        <AccordionItem
          ref={ref}
          value="item-1"
        >
          content
        </AccordionItem>
      </Accordion>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('AccordionTrigger', () => {
  it('renders children and chevron icon', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Toggle</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger className="trigger-custom">Toggle</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByTestId('accordion-trigger').className).toContain('trigger-custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger ref={ref}>Toggle</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('AccordionContent', () => {
  it('renders children inside a wrapper div', () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent>Panel body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Panel body')).toBeInTheDocument();
  });

  it('merges custom className on the inner wrapper', () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent className="content-custom">Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const innerDiv = container.querySelector('.content-custom');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv?.className).toContain('pb-4');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionContent ref={ref}>Body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
