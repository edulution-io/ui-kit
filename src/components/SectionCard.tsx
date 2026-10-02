/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React from 'react';
import AnchorSection from './AnchorSection';
import cn from '../utils/cn';
import { SECTION_CARD_STYLES, SectionCardPadding, SectionCardVariant } from '../constants/sectionCardStyles';

interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'id'> {
  id?: string;
  surfaceId?: string;
  label?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  variant?: SectionCardVariant;
  padding?: SectionCardPadding;
  bordered?: boolean;
  withBackground?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  id,
  surfaceId,
  label,
  header,
  children,
  className,
  headerClassName,
  bodyClassName,
  variant = 'default',
  padding = 'default',
  bordered = true,
  withBackground = true,
  onClick,
  onKeyDown,
  tabIndex,
  ...surfaceProps
}) => {
  const spacing = SECTION_CARD_STYLES.padding[padding];
  const isInteractive = typeof onClick === 'function';
  const wrapperClassName = cn(
    SECTION_CARD_STYLES.surfaceBase,
    SECTION_CARD_STYLES.variantBackground[variant],
    !bordered && 'border-0',
    !withBackground && '!bg-transparent !shadow-none backdrop-blur-none',
    isInteractive && 'cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    className,
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.currentTarget.click();
  };

  const surfaceInteraction = isInteractive
    ? { onClick, onKeyDown: handleKeyDown, tabIndex: tabIndex ?? 0 }
    : { onClick, onKeyDown, tabIndex };

  const headerNode =
    header ??
    (label != null ? (
      <div className={cn(SECTION_CARD_STYLES.headerBase, spacing.header, headerClassName)}>
        {typeof label === 'string' ? <h3>{label}</h3> : label}
      </div>
    ) : null);

  const body = (
    <>
      {headerNode}
      <div
        className={cn(
          SECTION_CARD_STYLES.bodyBase,
          spacing.body,
          headerNode ? 'pt-0' : spacing.bodyWithoutHeader,
          bodyClassName,
        )}
      >
        {children}
      </div>
    </>
  );

  if (id) {
    return (
      <section
        id={surfaceId}
        className={wrapperClassName}
        {...surfaceInteraction}
        {...surfaceProps}
      >
        <AnchorSection id={id}>{body}</AnchorSection>
      </section>
    );
  }

  return (
    <section
      id={surfaceId}
      className={wrapperClassName}
      {...surfaceInteraction}
      {...surfaceProps}
    >
      {body}
    </section>
  );
};

export default SectionCard;
export type { SectionCardProps };
