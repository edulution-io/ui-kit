/*
 * Copyright (C) 2024-2026 Digitale Schule Innovationsberatung GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-DSI-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import process from 'node:process';

const PACKAGE_NAME = '@edulution-io/ui-kit';
const SCOPE = '@edulution-io';
const NOT_FOUND = '"E404"';
const REGISTRIES = {
  'github-packages': 'https://npm.pkg.github.com',
  npmjs: 'https://registry.npmjs.org',
};
const CHANNELS = [
  { name: 'release', version: /^\d+\.\d+\.\d+$/, ref: 'refs/heads/master', distTag: 'latest', tag: true },
  { name: 'next', version: /^\d+\.\d+\.\d+-next\.\d+$/, ref: 'refs/heads/next', distTag: 'next', tag: false },
];

const isPublished = (version, registry) => {
  try {
    execFileSync(
      'npm',
      ['view', `${PACKAGE_NAME}@${version}`, 'version', `--${SCOPE}:registry=${registry}`, '--json'],
      {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    return true;
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    if (output.includes(NOT_FOUND)) {
      return false;
    }
    throw new Error(`Could not look up ${PACKAGE_NAME}@${version} on ${registry}: ${output.trim()}`);
  }
};

const readPreviousVersion = () => {
  try {
    return JSON.parse(
      execFileSync('git', ['show', 'HEAD^:package.json'], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }),
    ).version;
  } catch {
    return undefined;
  }
};

const planPublish = (version, ref, previousVersion) => {
  const channel = CHANNELS.find((candidate) => candidate.version.test(version));
  if (!channel) {
    throw new Error(`package.json holds neither a release X.Y.Z nor a next X.Y.Z-next.N version: ${version}`);
  }
  if (ref !== channel.ref) {
    throw new Error(`${version} is a ${channel.name} version and is published from ${channel.ref}, not from ${ref}`);
  }
  const missing = Object.entries(REGISTRIES).map(([name, registry]) => [
    `publish-${name}`,
    !isPublished(version, registry),
  ]);
  const publishes = missing.some(([, isMissing]) => isMissing);
  return {
    version,
    'dist-tag': channel.distTag,
    ...Object.fromEntries(missing.map(([key, isMissing]) => [key, String(isMissing)])),
    tag: String(channel.tag && (version !== previousVersion || publishes)),
  };
};

try {
  const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));
  const plan = planPublish(version, process.env.GITHUB_REF, readPreviousVersion());
  const lines = Object.entries(plan).map(([key, value]) => `${key}=${value}`);
  appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
  console.log(lines.join('\n'));
} catch (error) {
  console.error(`::error::${error.message}`);
  process.exit(1);
}
