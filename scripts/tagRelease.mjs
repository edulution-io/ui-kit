/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { execFileSync } from 'node:child_process';
import process from 'node:process';

const RELEASE_VERSION = /^\d+\.\d+\.\d+$/;
const NOT_FOUND = 'HTTP 404';

const gh = (args) => execFileSync('gh', args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const findTaggedCommit = (repository, tag) => {
  try {
    return gh(['api', `repos/${repository}/git/ref/tags/${tag}`, '--jq', '.object.sha']);
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    if (output.includes(NOT_FOUND)) {
      return null;
    }
    throw new Error(`Could not look up the tag ${tag}: ${output.trim()}`);
  }
};

const tagRelease = ({ version, repository, sha }) => {
  if (!RELEASE_VERSION.test(version ?? '')) {
    throw new Error(`The publish job handed over no release version: ${version}`);
  }
  const tag = `v${version}`;
  const tagged = findTaggedCommit(repository, tag);
  if (tagged === null) {
    gh(['api', '-X', 'POST', `repos/${repository}/git/refs`, '-f', `ref=refs/tags/${tag}`, '-f', `sha=${sha}`]);
    return `${tag} created on ${sha}`;
  }
  if (tagged !== sha) {
    throw new Error(`${tag} already tags ${tagged}, not ${sha}`);
  }
  return `${tag} already tags ${sha}`;
};

try {
  console.log(
    tagRelease({
      version: process.env.VERSION,
      repository: process.env.GITHUB_REPOSITORY,
      sha: process.env.GITHUB_SHA,
    }),
  );
} catch (error) {
  console.error(`::error::${error.message}`);
  process.exit(1);
}
