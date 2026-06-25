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
  ...surfaceProps
}) => {
  const spacing = SECTION_CARD_STYLES.padding[padding];
  const wrapperClassName = cn(
    SECTION_CARD_STYLES.surfaceBase,
    SECTION_CARD_STYLES.variantBackground[variant],
    !bordered && 'border-0',
    !withBackground && '!bg-transparent !shadow-none backdrop-blur-none',
    className,
  );

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
      {...surfaceProps}
    >
      {body}
    </section>
  );
};

export default SectionCard;
export type { SectionCardProps };
