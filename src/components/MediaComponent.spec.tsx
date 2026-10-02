/*
 * Copyright (C) 2024-2026 Netzint GmbH
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Netzint-Commercial
 * See LICENSE and LICENSES/ in the project root for the full license terms.
 */

import { render } from '@testing-library/react';
import MediaComponent from './MediaComponent';

beforeAll(() => {
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('MediaComponent', () => {
  it('renders a video element by default', () => {
    const { container } = render(<MediaComponent url="https://example.com/video.mp4" />);
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    expect(video.getAttribute('src')).toBe('https://example.com/video.mp4');
  });

  it('renders an audio element when isVideo is false', () => {
    const { container } = render(
      <MediaComponent
        url="https://example.com/audio.mp3"
        isVideo={false}
      />,
    );
    const audio = container.querySelector('audio');
    expect(audio).toBeTruthy();
    expect(audio.getAttribute('src')).toBe('https://example.com/audio.mp3');
  });

  it('applies loop and muted props to video', () => {
    const { container } = render(
      <MediaComponent
        url="test.mp4"
        loop
        muted
      />,
    );
    const video = container.querySelector('video');
    expect(video.loop).toBe(true);
    expect(video.muted).toBe(true);
  });

  it('renders controls on audio by default', () => {
    const { container } = render(
      <MediaComponent
        url="test.mp3"
        isVideo={false}
      />,
    );
    const audio = container.querySelector('audio');
    expect(audio.controls).toBe(true);
  });

  it('hides controls when controls is false', () => {
    const { container } = render(
      <MediaComponent
        url="test.mp4"
        controls={false}
      />,
    );
    const video = container.querySelector('video');
    expect(video.controls).toBe(false);
  });

  it('calls play on mount when playing is true', () => {
    render(<MediaComponent url="test.mp4" />);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('calls pause when playing is false', () => {
    render(
      <MediaComponent
        url="test.mp4"
        playing={false}
      />,
    );
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('applies custom width and height via style', () => {
    const { container } = render(
      <MediaComponent
        url="test.mp4"
        width="640px"
        height="480px"
      />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('640px');
    expect(wrapper.style.height).toBe('480px');
  });

  it('includes a captions track for accessibility', () => {
    const { container } = render(<MediaComponent url="test.mp4" />);
    const track = container.querySelector('track');
    expect(track).toBeTruthy();
    expect(track.getAttribute('kind')).toBe('captions');
  });
});
