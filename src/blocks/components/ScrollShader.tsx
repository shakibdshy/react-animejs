/**
 * ScrollShader — a native WebGL scroll-distortion gallery.
 *
 * Each frame owns a small WebGL canvas. AnimeScroll supplies one shared,
 * signed velocity so every shader bends with the same scroll gesture while
 * Anime handles the stage's intro reveal. The image remains visible as a
 * fallback when WebGL or a remote texture is unavailable.
 */
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Gauge, Sparkles } from 'lucide-react';
import type { ScrollObserver } from 'animejs';
import { Anime, AnimeScroll, utils } from '@/lib/react-animejs';

const { clamp } = utils;

// Anime.js reports scroll velocity in pixels per millisecond and exposes
// direction separately through `backward`. Keep the shader input in a stable
// signed -1..1 range instead of treating velocity as pixels per second.
const normalizeScrollVelocity = (velocity: number, backward: boolean) => {
  const magnitude = clamp(velocity * 0.5, 0, 1);
  return backward ? -magnitude : magnitude;
};

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uVelocityStrength;

  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float textureRatio = uTextureSize.x / uTextureSize.y;
    float quadRatio = uQuadSize.x / uQuadSize.y;
    vec2 scale = vec2(1.0);

    if (quadRatio > textureRatio) {
      scale.y = textureRatio / quadRatio;
    } else {
      scale.x = quadRatio / textureRatio;
    }

    return uv * scale + (1.0 - scale) * 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    float strength = uVelocityStrength;
    float direction = sign(uScrollVelocity);
    float time = uTime * (0.85 + strength * 1.4);
    vec2 centered = uv - 0.5;

    // Build a broad liquid field instead of displacing only one RGB edge. The
    // low-frequency waves move the whole image while the detail waves keep it
    // feeling like a shader surface during fast scrolls.
    vec2 flow = vec2(
      sin(uv.y * 10.0 + time * 1.7 * direction) * 0.075,
      cos(uv.x * 8.0 - time * 1.25 * direction) * 0.055
    );
    flow += vec2(
      sin(uv.y * 32.0 + time * 2.8) * 0.016,
      cos(uv.x * 28.0 - time * 2.2) * 0.016
    );
    float lens = dot(centered, centered);
    uv += (flow + centered * lens * 0.32 * sin(time * 0.7)) * strength;

    float chroma = strength * (0.008 + strength * 0.032);
    vec2 shift = vec2(chroma * direction, 0.0) + flow * strength * 0.22;
    float red = texture2D(uTexture, uv + shift).r;
    float green = texture2D(uTexture, uv).g;
    float blue = texture2D(uTexture, uv - shift).b;
    vec3 color = vec3(red, green, blue);
    float shimmer = 0.5 + 0.5 * sin((uv.x + uv.y) * 18.0 + time * 2.0);
    color *= 1.0 + shimmer * strength * 0.12;
    color += vec3(0.02, 0.035, 0.045) * shimmer * strength;

    gl_FragColor = vec4(color, 1.0);
  }
`;

type ScrollSignal = {
  targetVelocity: number;
  targetStrength: number;
};

type ShaderFrameProps = {
  src: string;
  number: string;
  title: string;
  signal: { current: ScrollSignal };
  accent: string;
};

type ShaderStatus = 'loading' | 'ready' | 'fallback';

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

const ShaderFrame = memo(function ShaderFrame({
  src,
  number,
  title,
  signal,
  accent,
}: ShaderFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<ShaderStatus>('loading');
  const smoothSignalRef = useRef({ velocity: 0, strength: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setStatus('fallback');
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      setStatus('fallback');
      return;
    }

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const textureLocation = gl.getUniformLocation(program, 'uTexture');
    const textureSizeLocation = gl.getUniformLocation(program, 'uTextureSize');
    const quadSizeLocation = gl.getUniformLocation(program, 'uQuadSize');
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const velocityLocation = gl.getUniformLocation(program, 'uScrollVelocity');
    const strengthLocation = gl.getUniformLocation(program, 'uVelocityStrength');
    const buffer = gl.createBuffer();

    if (
      positionLocation < 0 ||
      !textureLocation ||
      !textureSizeLocation ||
      !quadSizeLocation ||
      !timeLocation ||
      !velocityLocation ||
      !strengthLocation ||
      !buffer
    ) {
      gl.deleteProgram(program);
      setStatus('fallback');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    if (!texture) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      setStatus('fallback');
      return;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(textureLocation, 0);

    const image = new Image();
    image.crossOrigin = 'anonymous';

    let disposed = false;
    let animationFrame = 0;
    let startedAt = performance.now();
    let lastWidth = 0;
    let lastHeight = 0;

    const resize = () => {
      const rect = frame.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * pixelRatio));
      const height = Math.max(1, Math.round(rect.height * pixelRatio));

      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(quadSizeLocation, rect.width, rect.height);
    };

    const render = (now: number) => {
      if (disposed) return;
      resize();
      gl.useProgram(program);
      const current = smoothSignalRef.current;
      current.velocity += (signal.current.targetVelocity - current.velocity) * 0.18;
      current.strength += (signal.current.targetStrength - current.strength) * 0.14;
      gl.uniform1f(timeLocation, (now - startedAt) * 0.001);
      gl.uniform1f(velocityLocation, current.velocity);
      gl.uniform1f(strengthLocation, current.strength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrame = requestAnimationFrame(render);
    };

    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (gl.getError() !== gl.NO_ERROR) {
        setStatus('fallback');
        return;
      }
      gl.uniform2f(textureSizeLocation, image.naturalWidth || 1, image.naturalHeight || 1);
      setStatus('ready');
      startedAt = performance.now();
      resize();
      animationFrame = requestAnimationFrame(render);
    };

    image.onerror = () => {
      if (!disposed) setStatus('fallback');
    };

    image.src = src;

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(frame);
    window.addEventListener('resize', resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      image.onload = null;
      image.onerror = null;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [signal, src]);

  return (
    <article
      ref={frameRef}
      className="group relative mx-auto aspect-16/10 w-[88%] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#101414] shadow-[0_22px_70px_rgba(0,0,0,0.34)]"
    >
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-transparent" />
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
        <div>
          <span
            className="landing-font-mono text-[10px] uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            Shader frame / {number}
          </span>
          <h3 className="landing-font-display mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h3>
        </div>
        <span className="landing-font-mono rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-white/60 backdrop-blur">
          {status === 'ready' ? 'webgl live' : 'image fallback'}
        </span>
      </div>
    </article>
  );
});

type ShaderImage = Omit<ShaderFrameProps, 'signal'>;

const shaderImage = (id: string, start: string, end: string, accent: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
      <defs>
        <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${start}"/>
          <stop offset="1" stop-color="${end}"/>
        </linearGradient>
        <radialGradient id="glow-${id}" cx="72%" cy="28%" r="68%">
          <stop offset="0" stop-color="${accent}" stop-opacity=".9"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
        <filter id="grain-${id}">
          <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="1200" height="750" fill="url(#bg-${id})"/>
      <circle cx="870" cy="160" r="310" fill="url(#glow-${id})"/>
      <path d="M-80 560 C220 350 360 720 660 490 S1020 360 1280 180" fill="none" stroke="${accent}" stroke-opacity=".48" stroke-width="22"/>
      <path d="M-100 690 C210 470 430 820 720 600 S1030 480 1300 300" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
      <rect width="1200" height="750" filter="url(#grain-${id})" opacity=".42"/>
    </svg>
  `)}`;

const SHADER_IMAGES: ShaderImage[] = [
  {
    src: shaderImage('aurora', '#07151b', '#123d44', '#7de4ff'),
    number: '01',
    title: 'Electric weather',
    accent: '#7de4ff',
  },
  {
    src: shaderImage('canyon', '#250d0b', '#6b241b', '#ff7a59'),
    number: '02',
    title: 'Red horizon',
    accent: '#ff7a59',
  },
  {
    src: shaderImage('quiet', '#151122', '#3c2857', '#d2b4ff'),
    number: '03',
    title: 'Quiet geometry',
    accent: '#d2b4ff',
  },
  {
    src: shaderImage('tide', '#071b15', '#174b3b', '#73e0a6'),
    number: '04',
    title: 'Tidal memory',
    accent: '#73e0a6',
  },
];

export const ScrollShader = memo(function ScrollShader({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<ScrollSignal>({
    targetVelocity: 0,
    targetStrength: 0,
  });
  const decayTimerRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const handleScrollUpdate = useCallback((observer: ScrollObserver) => {
    const targetVelocity = normalizeScrollVelocity(observer.velocity, observer.backward);
    signalRef.current.targetVelocity = targetVelocity;
    signalRef.current.targetStrength = Math.min(1, Math.abs(targetVelocity));

    if (decayTimerRef.current !== null) window.clearTimeout(decayTimerRef.current);
    decayTimerRef.current = window.setTimeout(() => {
      signalRef.current.targetVelocity = 0;
      signalRef.current.targetStrength = 0;
      decayTimerRef.current = null;
    }, 90);
  }, []);

  useEffect(
    () => () => {
      if (decayTimerRef.current !== null) window.clearTimeout(decayTimerRef.current);
    },
    []
  );

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  return (
    <AnimeScroll<HTMLDivElement, HTMLDivElement>
      container={containerRef}
      enter={{ target: 'top', container: 'top' }}
      leave={{ target: 'bottom', container: 'bottom' }}
      onUpdate={handleScrollUpdate}
      enabled={ready}
    >
      {({ ref: trackRef, progress, velocity, backward }) => {
        const normalizedProgress = clamp(progress, 0, 1);
        const normalizedVelocity = normalizeScrollVelocity(velocity, backward);
        const velocityStrength = Math.min(1, Math.abs(normalizedVelocity));

        return (
          <div
            className={`relative overflow-hidden rounded-2xl border border-landing-border/60 bg-[#050707] text-landing-fg ${className}`}
          >
            <div
              ref={containerRef}
              className="relative h-[min(78vh,700px)] overflow-y-auto overscroll-contain"
            >
              <div
                ref={trackRef}
                className="relative flex min-h-[480%] flex-col gap-24 py-20 sm:gap-32 sm:py-28"
              >
                <Anime
                  opacity={[0, 1]}
                  translateY={[18, 0]}
                  duration={700}
                  ease="outQuad"
                  autoplay
                  enabled={ready}
                >
                  <header className="mx-auto flex w-[88%] items-end justify-between gap-6 pb-2">
                    <div>
                      <p className="landing-font-mono text-[10px] uppercase tracking-[0.3em] text-landing-accent">
                        Scroll shader / WebGL canvas
                      </p>
                      <h2 className="landing-font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                        Let velocity leave a trace.
                      </h2>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
                        Each frame is its own shader surface. Scroll faster to pull color apart and
                        bend the image.
                      </p>
                    </div>
                    <ArrowDown className="mb-2 hidden h-5 w-5 animate-bounce text-white/35 sm:block" />
                  </header>
                </Anime>

                {SHADER_IMAGES.map((image) => (
                  <ShaderFrame key={image.number} {...image} signal={signalRef} />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between sm:inset-x-8">
                <span className="landing-font-mono flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/40">
                  <Sparkles className="h-3.5 w-3.5 text-landing-accent" />
                  live distortion
                </span>
                <span className="landing-font-mono flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/40">
                  <Gauge className="h-3.5 w-3.5" />
                  {Math.round(velocityStrength * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#0a0c0c] px-5 py-4 sm:px-7">
              <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                scroll velocity → shader strength
              </span>
              <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-landing-accent transition-[width] duration-100"
                  style={{ width: `${Math.round(normalizedProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      }}
    </AnimeScroll>
  );
});

export default ScrollShader;
