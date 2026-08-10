// The background "field": a WebGL nebula plus a canvas particle cloud.
//
// Kept out of the React tree on purpose — these are imperative renderers with
// their own lifecycles. <Field /> owns the rAF loop and feeds them state.
//
// Nebula  : domain-warped fbm, silver ramp, reacts to cursor / scroll / hover.
// Cloud   : lens-bokeh particles in four depth layers, additive, screen-blended
//           over the nebula so the lights read as passing through it.

export type Vec3 = readonly [number, number, number];

// Silver ramp, matching the --field-* tokens in globals.css. Deliberately
// low-chroma: the red cloud is the only saturated thing on screen.
export const SILVER_RAMP: readonly Vec3[] = [
  [0.024, 0.027, 0.039], // void
  [0.09, 0.102, 0.125], // deep
  [0.235, 0.259, 0.294], // mid
  [0.651, 0.682, 0.722], // soft
  [0.941, 0.949, 0.961], // foam
];

/* ------------------------------------------------------------------ */
/*  Nebula                                                             */
/* ------------------------------------------------------------------ */

export type NebulaState = {
  mx: number;
  my: number;
  scroll: number;
  bloomX: number;
  bloomY: number;
  bloomZ: number;
  waveX: number;
  waveY: number;
  waveZ: number;
  calm: number;
};

export type Nebula = {
  resize(scale: number): void;
  draw(state: NebulaState, timeSec: number): void;
  dispose(): void;
};

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAG = [
  "#ifdef GL_FRAGMENT_PRECISION_HIGH",
  "precision highp float;",
  "#else",
  "precision mediump float;",
  "#endif",
  "uniform vec2 u_res;uniform float u_t;uniform vec2 u_m;uniform float u_s;",
  "uniform vec3 u_bloom;uniform vec3 u_wave;uniform float u_calm;",
  "uniform vec3 c0,c1,c2,c3,c4;",
  "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  " float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));",
  " return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}",
  "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}",
  "void main(){",
  " vec2 uv=gl_FragCoord.xy/u_res.xy;",
  " float ar=u_res.x/u_res.y;",
  " vec2 st=uv; st.x*=ar;",
  " float t=u_t*.055;",
  " vec2 m=u_m; m.x*=ar; float md=distance(st,m);",
  " vec2 pull=normalize(st-m+1e-5)*(.17/(md*6.+.55));",
  " vec2 b=u_bloom.xy; b.x*=ar; float bd=distance(st,b);",
  " vec2 bpull=normalize(st-b+1e-5)*(.24/(bd*5.+.5))*u_bloom.z;",
  " vec2 w=u_wave.xy; w.x*=ar; float wd=distance(st,w);",
  " float ring=exp(-pow((wd-(1.-u_wave.z)*1.35)*7.0,2.0))*u_wave.z;",
  " vec2 wpull=normalize(st-w+1e-5)*ring*.55;",
  " vec2 q=vec2(fbm(st*1.6+t),fbm(st*1.6+vec2(3.2,1.1)-t));",
  " vec2 r=vec2(fbm(st*1.6+q*2.0+t*1.4+u_s*.5),fbm(st*1.6+q*2.0+vec2(8.3,2.8)-t*1.1));",
  " float f=fbm(st*1.5+r*1.65-pull*2.2-bpull*2.8-wpull*3.2);",
  " vec3 col=mix(c0,c1,smoothstep(.14,.58,f));",
  " col=mix(col,c2,smoothstep(.38,.84,f+r.x*.36));",
  " col=mix(col,c3,smoothstep(.62,1.00,f+q.y*.52+u_s*.22));",
  " col=mix(col,c4,smoothstep(.90,1.14,f+r.y*.44));",
  " col+=c3*(.11/(md*7.+.42))*.6;",
  " col+=c4*(.15/(bd*6.+.40))*u_bloom.z;",
  " col+=c4*ring*.5;",
  " float vig=smoothstep(1.34,.20,distance(uv,vec2(.5)));",
  " col*=mix(.55,1.06,vig);",
  // The field quiets itself once you scroll past the hero. Content then reads
  // against a naturally darker nebula instead of a flat scrim laid over it.
  " col*=mix(1.0,0.42,clamp(u_s,0.,1.));",
  " float lum=dot(col,vec3(.299,.587,.114));",
  " col=mix(col,vec3(lum)*.6,u_calm);",
  " gl_FragColor=vec4(col,1.);",
  "}",
].join("\n");

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function createNebula(
  canvas: HTMLCanvasElement,
  ramp: readonly Vec3[] = SILVER_RAMP,
): Nebula | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
  } catch {
    return null;
  }
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const uRes = u("u_res");
  const uT = u("u_t");
  const uM = u("u_m");
  const uS = u("u_s");
  const uBloom = u("u_bloom");
  const uWave = u("u_wave");
  const uCalm = u("u_calm");

  ["c0", "c1", "c2", "c3", "c4"].forEach((name, i) => {
    const stop = ramp[i] ?? ramp[ramp.length - 1];
    gl.uniform3f(u(name), stop[0], stop[1], stop[2]);
  });

  return {
    resize(scale: number) {
      canvas.width = Math.max(2, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(2, Math.floor(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(state: NebulaState, timeSec: number) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, timeSec);
      gl.uniform2f(uM, state.mx, state.my);
      gl.uniform1f(uS, state.scroll);
      gl.uniform3f(uBloom, state.bloomX, state.bloomY, state.bloomZ);
      gl.uniform3f(uWave, state.waveX, state.waveY, state.waveZ);
      gl.uniform1f(uCalm, state.calm);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Cloud                                                              */
/* ------------------------------------------------------------------ */

type LayerSpec = {
  count: number;
  min: number;
  max: number;
  opMin: number;
  opMax: number;
  speed: number;
  sharp: boolean;
};

// Counts are quoted at 1920x1080 and scaled by viewport area.
//
// Deliberately far below the reference spec's numbers. That spec assumes GPU
// points; here every particle is a canvas drawImage, and the depth-of-field
// look comes from the size/blur spread across layers, not from raw count. The
// far layer is drawn as fillRect (1–2px dots gain nothing from a 108px sprite).
const LAYER_SPECS: readonly LayerSpec[] = [
  { count: 320, min: 1, max: 2, opMin: 0.4, opMax: 1.0, speed: 1, sharp: true },
  { count: 130, min: 3, max: 8, opMin: 0.5, opMax: 0.9, speed: 2, sharp: false },
  { count: 45, min: 20, max: 60, opMin: 0.25, opMax: 0.5, speed: 5, sharp: false },
  { count: 14, min: 90, max: 180, opMin: 0.1, opMax: 0.25, speed: 9, sharp: false },
];

const RIM_START = 0.85;
const RIM_BOOST = 1.45;
const FALLOFF = 0.08;
const BRIGHT_RATIO = 0.1;
const BRIGHT_BOOST = 2.2;
// Green and blue only appear in the top ~15% of luminance, which is what makes
// this read as a single-channel sensor image rather than a red CSS filter.
const G_THRESHOLD = 0.82;
const B_THRESHOLD = 0.86;
const CHANNEL_GAIN = 4;

type Particle = {
  x: number;
  y: number;
  r: number;
  o: number;
  hot: boolean;
  v: number;
  life: number;
};

export type Cloud = {
  resize(): void;
  rebuild(): void;
  draw(dtMs: number, intensity: number, velocity: number, rush: number): void;
  clear(): void;
};

function mapLuminance(L: number): string {
  const r = Math.min(1, 0.08 + L);
  const g = Math.min(1, Math.max(0, L - G_THRESHOLD) * CHANNEL_GAIN);
  const b = Math.min(1, 0.008 + Math.max(0, L - B_THRESHOLD) * CHANNEL_GAIN);
  return `${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}`;
}

// Lens bokeh, not a soft blob: flat interior, brighter rim at 85–100% of the
// radius, then a fast falloff. Rendered once per size tier and reused.
function makeDisc(luminance: number, sharp: boolean): HTMLCanvasElement {
  const px = 48;
  const pad = Math.ceil(px * (1 + FALLOFF)) + 2;
  const size = pad * 2;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  if (sharp) {
    ctx.fillStyle = `rgb(${mapLuminance(Math.min(1, luminance))})`;
    ctx.beginPath();
    ctx.arc(pad, pad, px, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  const outer = px * (1 + FALLOFF);
  const rimAt = RIM_START / (1 + FALLOFF);
  const edge = 1 / (1 + FALLOFF);
  const flat = mapLuminance(Math.min(1, luminance));
  const rim = mapLuminance(Math.min(1, luminance * RIM_BOOST));

  const g = ctx.createRadialGradient(pad, pad, 0, pad, pad, outer);
  g.addColorStop(0, `rgba(${flat},1)`);
  g.addColorStop(rimAt, `rgba(${flat},1)`);
  g.addColorStop((rimAt + edge) / 2, `rgba(${rim},1)`);
  g.addColorStop(edge, `rgba(${rim},.9)`);
  g.addColorStop(1, `rgba(${flat},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(pad, pad, outer, 0, Math.PI * 2);
  ctx.fill();

  // Faint interior variation so the discs are not perfectly clean.
  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < 3; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * px * 0.5;
    const bx = pad + Math.cos(a) * d;
    const by = pad + Math.sin(a) * d;
    const br = px * (0.18 + Math.random() * 0.28);
    const v = Math.random() < 0.5 ? 0 : 255;
    const gg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    gg.addColorStop(0, `rgba(${v},${v},${v},.08)`);
    gg.addColorStop(1, `rgba(${v},${v},${v},0)`);
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

export function createCloud(canvas: HTMLCanvasElement): Cloud | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let sprites: { base: HTMLCanvasElement[]; hot: HTMLCanvasElement[] }[] = [];
  let layers: Particle[][] = [];
  let clock = 0;

  // Half resolution, upscaled by CSS. Defocused bokeh is the one thing that
  // genuinely loses nothing to it, and it quarters the fill cost.
  const SCALE = 0.5;
  const dpr = () => SCALE;

  return {
    resize() {
      const d = dpr();
      canvas.width = Math.floor(window.innerWidth * d);
      canvas.height = Math.floor(window.innerHeight * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    },
    rebuild() {
      const area = Math.max(
        0.35,
        (window.innerWidth * window.innerHeight) / (1920 * 1080),
      );
      const mobile = window.innerWidth < 800 ? 0.4 : 1;
      sprites = [];
      layers = [];
      for (const spec of LAYER_SPECS) {
        const base: HTMLCanvasElement[] = [];
        const hot: HTMLCanvasElement[] = [];
        // The sharp far layer is drawn with fillRect, so it needs no sprites.
        if (!spec.sharp) {
          for (let i = 0; i < 4; i++) {
            const lum = 0.42 + i * 0.16;
            base.push(makeDisc(lum, false));
            hot.push(makeDisc(Math.min(1, lum * BRIGHT_BOOST), false));
          }
        }
        sprites.push({ base, hot });

        const n = Math.round(spec.count * area * mobile);
        const arr: Particle[] = [];
        for (let i = 0; i < n; i++) {
          arr.push({
            x: Math.random(),
            y: Math.random(),
            r: (spec.min + Math.random() * (spec.max - spec.min)) / 2,
            o: spec.opMin + Math.random() * (spec.opMax - spec.opMin),
            hot: Math.random() < BRIGHT_RATIO,
            v: Math.floor(Math.random() * 4),
            life: Math.random(),
          });
        }
        layers.push(arr);
      }
    },
    clear() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    },
    draw(dtMs, intensity, velocity, rush) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const d = dpr();
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Scroll velocity drives the flight speed: flick the wheel and the lights
      // streak past; the portal rush multiplies it further.
      clock += (dtMs * 0.001) * (1 + Math.min(6, Math.abs(velocity) * 0.09) + rush * 5);
      const swayX = Math.sin((clock * Math.PI * 2) / 19) * 6;
      const swayY = Math.cos((clock * Math.PI * 2) / 26) * 4;

      ctx.globalCompositeOperation = "lighter";
      const farColor = `rgb(${mapLuminance(0.62)})`;
      for (let li = 0; li < LAYER_SPECS.length; li++) {
        const spec = LAYER_SPECS[li];
        const arr = layers[li];
        const set = sprites[li];
        if (!arr || !set) continue;
        // During the portal transit every layer is pushed radially outward,
        // near layers much further than far ones: a tunnel, not a zoom.
        const push = rush > 0.001 ? rush * (0.3 + spec.speed * 0.1) : 0;
        // Streaks are only drawn for the big, slow, few near layers. Doing it
        // for all of them multiplied the per-frame draw count by four.
        const streak = push > 0.001 && spec.speed >= 5;

        for (let i = 0; i < arr.length; i++) {
          const p = arr[i];
          let y = (p.y + clock * spec.speed * 0.01) % 1;
          if (y < 0) y += 1;
          let x = (p.x + clock * spec.speed * 0.01 * 0.22) % 1;
          if (x < 0) x += 1;
          const grow = 1 + ((p.life + clock * 0.05) % 1) * 0.15;
          const r = p.r * grow;
          const size = r * 2;
          const px = x * W + swayX * (li + 1) * 0.35;
          const py = y * H + swayY * (li + 1) * 0.35;
          const img = (p.hot ? set.hot : set.base)[p.v];

          const ox = push > 0.001 ? W * 0.5 + (px - W * 0.5) * (1 + push) : px;
          const oy = push > 0.001 ? H * 0.5 + (py - H * 0.5) * (1 + push) : py;

          if (spec.sharp) {
            // 1–2px dots: a fill is an order of magnitude cheaper than a blit.
            ctx.globalAlpha = p.o * intensity;
            ctx.fillStyle = farColor;
            ctx.fillRect(ox - r, oy - r, size, size);
          } else if (streak) {
            const dx = ox - W * 0.5;
            const dy = oy - H * 0.5;
            for (let g = 1; g >= 0; g--) {
              const k = 1 - (push * 0.5 * g) / (1 + push);
              ctx.globalAlpha = p.o * intensity * (g === 0 ? 1 : 0.3);
              ctx.drawImage(
                img,
                W * 0.5 + dx * k - r,
                H * 0.5 + dy * k - r,
                size,
                size,
              );
            }
          } else {
            ctx.globalAlpha = p.o * intensity;
            ctx.drawImage(img, ox - r, oy - r, size, size);
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
}
