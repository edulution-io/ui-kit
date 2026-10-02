/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import React, { useEffect, useRef } from 'react';

interface MediaComponentProps {
  url: string;
  isVideo?: boolean;
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

const MediaComponent: React.FC<MediaComponentProps> = ({
  url,
  isVideo = true,
  playing = true,
  loop = false,
  controls = true,
  volume = 0.8,
  muted = false,
  playbackRate = 1.0,
  width = '100%',
  height = '100%',
  style = {},
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.volume = volume;
    media.playbackRate = playbackRate;

    if (playing) {
      media.play().catch(() => {});
    } else {
      media.pause();
    }
  }, [playing, volume, playbackRate]);

  const commonProps = {
    src: url,
    loop,
    controls,
    muted,
    autoPlay: playing,
  };

  if (isVideo) {
    return (
      <div style={{ position: 'relative', width, height, ...style }}>
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement | null>}
          {...commonProps}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width, height, ...style }}>
      <audio
        ref={mediaRef as React.RefObject<HTMLAudioElement | null>}
        {...commonProps}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
};

export default MediaComponent;
export type { MediaComponentProps };
