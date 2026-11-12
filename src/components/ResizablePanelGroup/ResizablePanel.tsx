/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import * as React from 'react';
import { Panel, type PanelProps } from 'react-resizable-panels';

const ResizablePanel: React.FC<PanelProps> = (props) => <Panel {...props} />;

export default ResizablePanel;
