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
