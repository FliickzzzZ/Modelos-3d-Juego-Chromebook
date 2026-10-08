(async () => {
    "use strict";
    const t = await (import("https://esm.sh/three@0.160.1")), {GLTFLoader: e} = await (import("https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?deps=three@0.160.1")), {clone: o} = await (import("https://esm.sh/three@0.160.1/examples/jsm/utils/SkeletonUtils.js?deps=three@0.160.1")), n = t => document.getElementById(t), i = n("game");
    if (!i) throw Error("Falta #game en el HTML");
    const a = new t.Scene, s = new t.Group;
    a.add(s);
    const r = new t.Group;
    a.add(r);
    const c = {
        position: r.position,
        mode: "explore",
        moving: !1
    };
    a.background = new t.Color(8161667), a.fog = new t.FogExp2(8161667, .018);
    const l = new t.PerspectiveCamera(78, Math.max(1, i.clientWidth) / Math.max(1, i.clientHeight), .05, 200);
    l.position.set(0, 1.7, 0);
    const d = new t.WebGLRenderer({
        antialias: !1,
        powerPreference: "low-power"
    });
    d.setPixelRatio(Math.min(devicePixelRatio, 1)), d.setSize(Math.max(1, i.clientWidth), Math.max(1, i.clientHeight)), 
    d.outputColorSpace = t.SRGBColorSpace, d.toneMapping = t.ACESFilmicToneMapping, d.toneMappingExposure = 1.05, 
    i.prepend(d.domElement), a.add(l), d.shadowMap.enabled = !0, d.shadowMap.type = t.PCFSoftShadowMap, a.add(new t.HemisphereLight(12637391, 3422248, 1.35));
    const u = new t.DirectionalLight(16771792, 2.1);
    u.position.set(-18, 30, 15), u.castShadow = !0, u.shadow.mapSize.set(1024, 1024), u.shadow.camera.left = -25, 
    u.shadow.camera.right = 25, u.shadow.camera.top = 44, u.shadow.camera.bottom = -44, u.shadow.camera.near = 1, 
    u.shadow.camera.far = 90, u.shadow.normalBias = .045, u.shadow.bias = -2e-4, a.add(u);
    const h = (e, o = 0) => new t.MeshStandardMaterial({
        color: e,
        roughness: .85,
        metalness: o
    }), p = new t.BoxGeometry(1, 1, 1), m = {
        road: h(2763824),
        ground: h(5395279),
        walk: h(7894900),
        line: h(13288362),
        glass: h(1516587),
        dark: h(2106150),
        skin: h(7634529),
        cloth: h(5264986)
    };
    function f(e, o, n, i, a, s, r, c) {
        const l = new t.Mesh(p, c);
        return l.position.set(o, n, i), l.scale.set(a, s, r), e.add(l), l;
    }
    const g = [], w = (t, e, o, n, i = 3) => g.push({
        x: t,
        z: e,
        w: o,
        d: n,
        h: i
    });
    function x(t, e, o = .38) {
        return Math.abs(t) > 22 - o || Math.abs(e) > 40 - o || g.some(n => Math.abs(t - n.x) < n.w / 2 + o && Math.abs(e - n.z) < n.d / 2 + o);
    }
    function v(t, e, o, n, i = .48) {
        const a = Math.hypot(o - t, n - e), s = Math.max(1, Math.ceil(a / .6));
        for (let a = 1; a <= s; a++) {
            const r = a / s;
            if (x(t + (o - t) * r, e + (n - e) * r, i)) return !1;
        }
        return !0;
    }
    const y = [];
    function M(t, e) {
        return Math.abs(t) > 4.9 && Math.abs(t) < 8.2 ? .22 : .06;
    }
    f(s, 0, -.2, 0, 44, .4, 80, m.ground).receiveShadow = !0;
    f(s, 0, .025, 0, 9.8, .05, 80, m.road).receiveShadow = !0;
    for (const t of [ -1, 1 ]) f(s, 6.55 * t, .11, 0, 3.3, .22, 80, m.walk).receiveShadow = !0, f(s, 5.05 * t, .14, 0, .22, .28, 80, m.walk);
    for (let t = -37; t < 40; t += 7) f(s, 0, .058, t, .09, .008, 2.1, m.line);
    w(-13, 3, 12.4, 12.6, 17), w(13, -13, 12.4, 14.3, 21);
    for (const [e, o, n] of [ [ 3.2, 14, .1 ], [ -3.2, -14, -.12 ], [ 3.3, -29, .2 ] ]) {
        const i = new t.Group;
        i.position.set(e, .06, o), i.rotation.y = n, s.add(i), y.push({
            g: i,
            low: new t.Group
        }), w(e, o, 2.3, 4.6, 1.6);
    }
    const b = h(4015424, .55), A = h(6178356, .25), z = h(7959915);
    function S(e, o, n, i, a, s, r) {
        const c = new t.Mesh(new t.CylinderGeometry(a, a, s, 7), r);
        return c.position.set(o, n, i), e.add(c), c.castShadow = !0, c;
    }
    for (const [t, e] of [ [ 6.6, 23 ], [ -6.6, -6 ], [ 6.6, -31 ] ]) S(s, t, 2.75, e, .075, 5.5, b), f(s, t - .5, 5.48, e, 1, .08, .1, b), 
    f(s, t - 1, 5.4, e, .65, .14, .35, b), w(t, e, .25, .25, 5.5);
    const L = new t.LineBasicMaterial({
        color: 2370338
    });
    let k = 47;
    function E() {
        return k = 1664525 * k + 1013904223 >>> 0, k / 4294967296;
    }
    const C = [];
    for (let t = 0; t < 95; t++) {
        let t = 9 * (E() - .5), e = 78 * (E() - .5);
        for (let o = 0; o < 5; o++) {
            const o = t + .7 * (E() - .5), n = e + .5 * E();
            C.push(t, .058, e, o, .058, n), t = o, e = n;
        }
    }
    const D = new t.BufferGeometry;
    D.setAttribute("position", new t.Float32BufferAttribute(C, 3));
    const T = new t.LineSegments(D, L);
    T.userData.decorative = !0, s.add(T);
    const O = new t.DodecahedronGeometry(1, 0), R = new t.InstancedMesh(O, z, 65), P = new t.Matrix4;
    for (let e = 0; e < 65; e++) {
        const o = (E() > .5 ? 1 : -1) * (4.4 + 2 * E()), n = 78 * (E() - .5);
        P.compose(new t.Vector3(o, .09, n), (new t.Quaternion).setFromEuler(new t.Euler(E(), 6 * E(), E())), new t.Vector3(.06 + .19 * E(), .035 + .12 * E(), .06 + .17 * E())), 
        R.setMatrixAt(e, P);
    }
    R.userData.decorative = !0, s.add(R);
    for (const [t, e] of [ [ -6.4, 19 ], [ 6.8, -2 ] ]) S(s, t, .55, e, .35, 1.1, b), S(s, t, 1.12, e, .39, .06, A);
    const I = document.createElement("canvas");
    I.width = 512, I.height = 256;
    const N = I.getContext("2d");
    N && (N.fillStyle = "#29403a", N.fillRect(0, 0, 512, 256), N.strokeStyle = "#bfc3a7", N.lineWidth = 10, N.strokeRect(12, 12, 488, 232), 
    N.fillStyle = "#d4d1b8", N.font = "bold 44px Arial", N.textAlign = "center", N.fillText("CALLE DEL OLIVO", 256, 110), 
    N.font = "27px Arial", N.fillText("ACCESO RESTRINGIDO", 256, 175));
    const _ = new t.CanvasTexture(I);
    _.colorSpace = t.SRGBColorSpace, f(s, -6.8, 2.8, 28, 2.2, 1.1, .06, new t.MeshStandardMaterial({
        map: _,
        roughness: 1
    })), S(s, -6.8, 1.3, 28, .04, 2.6, b);
    const F = -40, G = Math.round(40) + 1, B = .48, V = new Uint8Array(G * G);
    function U(t, e) {
        return e * G + t;
    }
    function j(t, e) {
        return {
            x: F + 2 * t,
            z: F + 2 * e
        };
    }
    function W() {
        let t = 0;
        for (let e = 0; e < G; e++) for (let o = 0; o < G; o++) {
            const n = j(o, e), i = !x(n.x, n.z, B);
            V[U(o, e)] = i ? 1 : 0, i && t++;
        }
        console.log("Navegación lista:", t, "casillas");
    }
    function q(t, e) {
        return function(t, e) {
            return t >= 0 && e >= 0 && t < G && e < G;
        }(t, e) && 1 === V[U(t, e)];
    }
    function Z(t, e) {
        const o = function(t, e) {
            return {
                ix: Math.round((t - F) / 2),
                iz: Math.round((e - F) / 2)
            };
        }(t, e);
        if (q(o.ix, o.iz)) return o;
        let n = null, i = 1 / 0;
        for (let a = 1; a <= 7; a++) {
            for (let s = -a; s <= a; s++) for (let r = -a; r <= a; r++) {
                const a = o.ix + r, c = o.iz + s;
                if (!q(a, c)) continue;
                const l = j(a, c), d = Math.hypot(l.x - t, l.z - e);
                d < i && (i = d, n = {
                    ix: a,
                    iz: c
                });
            }
            if (n) return n;
        }
        return null;
    }
    W();
    class J {
        constructor() {
            this.a = [];
        }
        push(t) {
            const e = this.a;
            e.push(t);
            let o = e.length - 1;
            for (;o > 0; ) {
                const n = o - 1 >> 1;
                if (e[n].f <= t.f) break;
                e[o] = e[n], o = n;
            }
            e[o] = t;
        }
        pop() {
            const t = this.a;
            if (!t.length) return null;
            const e = t[0], o = t.pop();
            if (!t.length) return e;
            let n = 0;
            for (;;) {
                const e = 2 * n + 1, i = e + 1;
                if (e >= t.length) break;
                let a = e;
                if (i < t.length && t[i].f < t[e].f && (a = i), t[a].f >= o.f) break;
                t[n] = t[a], n = a;
            }
            return t[n] = o, e;
        }
        get length() {
            return this.a.length;
        }
    }
    function K(t, e, o, n) {
        const i = Z(t, e), a = Z(o, n);
        if (!i || !a) return null;
        const s = U(i.ix, i.iz), r = U(a.ix, a.iz);
        if (s === r) return v(t, e, o, n, B) ? [ {
            x: o,
            z: n
        } ] : null;
        const c = G * G, l = new Float32Array(c), d = new Int32Array(c), u = new Uint8Array(c);
        l.fill(1 / 0), d.fill(-1);
        const h = new J;
        l[s] = 0;
        const p = (t, e) => Math.abs(t - a.ix) + Math.abs(e - a.iz);
        h.push({
            id: s,
            ix: i.ix,
            iz: i.iz,
            g: 0,
            f: p(i.ix, i.iz)
        });
        const m = [ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ];
        let f = 0, g = !1;
        for (;h.length && f < 4500; ) {
            f++;
            const t = h.pop();
            if (!u[t.id] && !(t.g > l[t.id])) {
                if (u[t.id] = 1, t.id === r) {
                    g = !0;
                    break;
                }
                for (const [e, o] of m) {
                    const n = t.ix + e, i = t.iz + o;
                    if (!q(n, i)) continue;
                    const a = U(n, i);
                    if (u[a]) continue;
                    const s = j(t.ix, t.iz), r = j(n, i);
                    if (!v(s.x, s.z, r.x, r.z, B)) continue;
                    const c = l[t.id] + 1;
                    c >= l[a] || (l[a] = c, d[a] = t.id, h.push({
                        id: a,
                        ix: n,
                        iz: i,
                        g: c,
                        f: c + p(n, i)
                    }));
                }
            }
        }
        if (!g) return null;
        const w = [];
        let x = r;
        for (;x !== s && x >= 0; ) {
            const t = x % G, e = Math.floor(x / G);
            if (w.push(j(t, e)), x = d[x], w.length > c) return null;
        }
        w.reverse();
        const y = [];
        let M = t, b = e, A = 0;
        for (;A < w.length; ) {
            let t = A;
            for (let e = A + 1; e < w.length && v(M, b, w[e].x, w[e].z, B); e++) t = e;
            const e = w[t];
            y.push(e), M = e.x, b = e.z, A = t + 1;
        }
        return y;
    }
    function H() {
        const t = r.position.x, e = r.position.z;
        for (let o = 0; o < 100; o++) {
            const o = Math.random() * Math.PI * 2, n = 13 + 10 * Math.random(), i = t + Math.sin(o) * n, a = e + Math.cos(o) * n;
            if (x(i, a, .65)) continue;
            if (kt.some(t => Math.hypot(t.actor.position.x - i, t.actor.position.z - a) < 1.5)) continue;
            if (v(i, a, t, e, .48)) return {
                x: i,
                z: a
            };
            if (K(i, a, t, e)) return {
                x: i,
                z: a
            };
        }
        const o = Z(t + 12, e + 12);
        if (o) {
            const t = j(o.ix, o.iz);
            if (!x(t.x, t.z, .65)) return t;
        }
        return null;
    }
    const X = new e, Y = t => "https://cdn.jsdelivr.net/gh/FliickzzzZ/Modelos-3d-Juego-Chromebook@main/" + t.split("/").map(encodeURIComponent).join("/"), Q = t => new Promise((e, o) => X.load(Y(t), e, void 0, o));
    let $ = !1, tt = !1;
    const et = {
        zombies: [],
        gun: null,
        car: null
    };
    function ot(t) {
        return o(t.scene);
    }
    function nt(e, o, n, i) {
        const a = new t.Group, s = new t.Group;
        a.add(s), s.add(e), e.updateMatrixWorld(!0);
        const r = (new t.Box3).setFromObject(e), c = r.getSize(new t.Vector3);
        if (!Number.isFinite(c.y) || c.y < 1e-5) throw Error("Dimensiones GLB inválidas");
        let l = o / c.y;
        n && c.x && (l = Math.min(l, n / c.x)), i && c.z && (l = Math.min(l, i / c.z)), a.scale.setScalar(l);
        const d = r.getCenter(new t.Vector3);
        return s.position.set(-d.x, -r.min.y, -d.z), a.updateMatrixWorld(!0), a;
    }
    function it(e) {
        return (e.animations || []).map(e => new t.AnimationClip(e.name, e.duration, e.tracks.map(t => {
            const e = t.clone(), o = e.name.replace(/\.(position|quaternion|scale)$/, "");
            if (/\.position$/.test(e.name) && /hips|pelvis|root|armature/i.test(o)) for (let t = 0; t < e.values.length; t += 3) e.values[t] = e.values[0], 
            e.values[t + 2] = e.values[2];
            return e;
        })));
    }
    const at = {};
    let st = null, rt = .6, ct = null;
    const lt = new Set, dt = new Map;
    function ut() {
        st ??= new (window.AudioContext || window.webkitAudioContext), st.resume().catch(() => {}), wt();
    }
    function ht(t) {
        for (const e of [ ...lt ]) if (!t || e.owner === t) {
            try {
                e.source.stop();
            } catch {}
            e.source.disconnect(), e.gain.disconnect(), e.panner?.disconnect(), lt.delete(e);
        }
    }
    function pt(t) {
        if (!st || "running" !== st.state || "zombie" === t) return;
        const e = {
            shot: [ 190, 48, .12 ],
            reload: [ 560, 180, .12 ],
            hurt: [ 140, 60, .2 ],
            death: [ 130, 40, .25 ],
            wave: [ 420, 700, .25 ],
            step: [ 85, 45, .055 ]
        }[t];
        if (!e) return;
        const o = st.createOscillator(), n = st.createGain(), i = st.currentTime;
        o.type = "wave" === t ? "triangle" : "sawtooth", o.frequency.setValueAtTime(e[0], i), o.frequency.exponentialRampToValueAtTime(e[1], i + e[2]), 
        n.gain.setValueAtTime(.04 * rt, i), n.gain.exponentialRampToValueAtTime(.001, i + e[2]), o.connect(n), n.connect(st.destination);
        const a = {
            source: o,
            gain: n,
            type: t
        };
        lt.add(a), o.onended = () => {
            lt.delete(a), o.disconnect(), n.disconnect();
        }, o.start(), o.stop(i + e[2]);
    }
    async function mt(t, e = null) {
        if (!st || "running" !== st.state || Gt) return;
        if ("zombie" === t && ([ ...lt ].filter(t => "zombie" === t.type).length >= 2 || [ ...lt ].some(t => t.owner === e))) return;
        const o = at[t];
        if (!o?.length) return void pt(t);
        const n = Kt, i = o[Math.floor(Math.random() * o.length)];
        try {
            dt.has(i) || dt.set(i, fetch(i).then(t => {
                if (!t.ok) throw Error(t.status);
                return t.arrayBuffer();
            }).then(t => st.decodeAudioData(t)));
            const o = await dt.get(i);
            if (n !== Kt || Gt || e && !kt.includes(e) || !Ft && "death" !== t) return;
            if ("zombie" === t && [ ...lt ].filter(t => "zombie" === t.type).length >= 2) return;
            const a = st.createBufferSource(), s = st.createGain();
            a.buffer = o;
            const r = {
                zombie: .1,
                zombieDeath: .12,
                shot: .65,
                reload: .45,
                hurt: .5,
                step: .18
            }[t] ?? .45;
            s.gain.value = rt * r, a.connect(s);
            let c = null;
            e ? (c = st.createPanner(), c.panningModel = "equalpower", c.distanceModel = "inverse", c.refDistance = 2, c.maxDistance = 20, 
            c.rolloffFactor = 1.8, s.connect(c), c.connect(st.destination)) : s.connect(st.destination);
            const l = {
                source: a,
                gain: s,
                panner: c,
                owner: e,
                type: t,
                base: r
            };
            lt.add(l), a.onended = () => {
                lt.delete(l), a.disconnect(), s.disconnect(), c?.disconnect();
            }, c && ft(l), a.start(), a.stop(st.currentTime + Math.min(o.duration, "zombie" === t ? 2.5 : "shot" === t ? .4 : 5));
        } catch (e) {
            dt.delete(i), n === Kt && !Gt && Ft && pt(t);
        }
    }
    function ft(t) {
        const e = t.owner.actor.position;
        t.panner.positionX.value = e.x, t.panner.positionY.value = e.y + 1.3, t.panner.positionZ.value = e.z;
    }
    function gt() {
        if (!st) return;
        const e = st.listener, o = l.position;
        if (e.positionX) {
            e.positionX.value = o.x, e.positionY.value = o.y, e.positionZ.value = o.z;
            const n = new t.Vector3(0, 0, -1).applyQuaternion(l.quaternion), i = new t.Vector3(0, 1, 0).applyQuaternion(l.quaternion);
            e.forwardX.value = n.x, e.forwardY.value = n.y, e.forwardZ.value = n.z, e.upX.value = i.x, e.upY.value = i.y, 
            e.upZ.value = i.z;
        }
        for (const t of lt) t.gain.gain.value = rt * (t.base ?? .04), t.panner && ft(t);
    }
    function wt() {
        at.ambience?.length && (ct || (ct = new Audio(at.ambience[0]), ct.loop = !0), ct.volume = .38 * rt, ct.play().catch(() => {}));
    }
    function xt() {
        ct?.pause();
    }
    !function(t) {
        const e = t.filter(t => /^Sonidos\//i.test(t.path) && /\.(wav|mp3|ogg|m4a)$/i.test(t.path)), o = {
            shot: /gunshot|pistol|disparo/i,
            reload: /reload|recarg/i,
            hurt: /grunt|hurt|pain/i,
            death: /male-scream|death/i,
            zombie: /zombie.*sound|groan|growl/i,
            zombieDeath: /zombie.*dying|zombie.*death/i,
            ambience: /ambien|soundscape|atmosphere/i
        };
        for (const [t, n] of Object.entries(o)) at[t] = e.filter(e => n.test(e.path) && (!("zombie" === t || "shot" === t) || !/dying|death|reload/i.test(e.path))).slice(0, 4).map(t => Y(t.path));
    }([ {
        path: "Sonidos/dragon-studio-gun-reload-2-504027.mp3"
    }, {
        path: "Sonidos/dragon-studio-zombie-dying-sound-357974.mp3"
    }, {
        path: "Sonidos/dragon-studio-zombie-sound-2-357976.mp3"
    }, {
        path: "Sonidos/freesound_community-grunt-1-85280.mp3"
    }, {
        path: "Sonidos/freesound_community-single-pistol-gunshot-33-37187.mp3"
    }, {
        path: "Sonidos/fronbondi_skegs-amb-a-post-apocalyptic-ambient-soundscape-452826.mp3"
    }, {
        path: "Sonidos/universfield-male-scream-121085.mp3"
    } ]);
    const vt = new t.Group;
    r.add(vt);
    const yt = new t.Group;
    vt.add(yt), f(yt, 0, 0, -.26, .19, .2, .63, h(1514012, .7)), f(yt, 0, -.17, -.04, .13, .32, .17, h(2697772)), 
    f(yt, 0, .09, -.48, .1, .07, .3, h(1514012, .7));
    const Mt = new t.PointLight(16760169, 0, 5);
    Mt.position.set(0, 0, -.8), vt.add(Mt);
    let bt = null, At = 0;
    const zt = [ [ 0, 0, 0 ], [ 0, Math.PI, 0 ], [ 0, Math.PI / 2, 0 ], [ 0, -Math.PI / 2, 0 ], [ Math.PI / 2, 0, 0 ], [ -Math.PI / 2, 0, 0 ], [ 0, 0, Math.PI / 2 ], [ 0, 0, -Math.PI / 2 ] ];
    function St() {
        bt && (bt.rotation.set(...zt[At]), console.log("Pistola orientación", At + 1, "/", zt.length));
    }
    const Lt = {}, kt = [], Et = new t.Clock, Ct = new t.Raycaster;
    let Dt = 100, Tt = 12, Ot = 96, Rt = 0, Pt = 0, It = 0, Nt = 0, _t = 0, Ft = !1, Gt = !1, Bt = !1, Vt = !1, Ut = 0, jt = 0, Wt = 0, qt = !0, Zt = 0, Jt = 0, Kt = 0, Ht = .25, Xt = 0, Yt = 0, Qt = 0, $t = 0, te = !1;
    const ee = {
        waves: {
            title: "OLEADAS",
            limit: 12
        },
        explore: {
            title: "EXPLORACIÓN · PROTOTIPO",
            limit: 6
        }
    };
    function oe() {
        n("health") && (n("health").textContent = Math.max(0, Math.ceil(Dt)) + " ♥"), n("ammo") && (n("ammo").textContent = (Bt ? "..." : Tt) + " / " + Ot), 
        n("wave") && (n("wave").textContent = Rt), n("kills") && (n("kills").textContent = Pt);
    }
    let ne;
    function ie(t) {
        const e = n("announcement");
        e && (e.textContent = t, e.style.opacity = 1, clearTimeout(ne), ne = setTimeout(() => {
            e.style.opacity = 0;
        }, 1700));
    }
    function ae() {
        const e = new t.Group;
        f(e, 0, 1.58, 0, .4, .42, .4, m.skin), f(e, 0, 1.05, 0, .65, .78, .34, m.cloth);
        const o = [], n = [];
        for (const t of [ -1, 1 ]) o.push(f(e, .43 * t, 1.07, 0, .2, .7, .2, m.skin)), n.push(f(e, .17 * t, .39, 0, .22, .76, .25, m.cloth));
        return {
            g: e,
            arms: o,
            legs: n
        };
    }
    function se(e, o) {
        if (x(e, o, .55)) {
            const t = Z(e, o);
            if (!t) return null;
            const n = j(t.ix, t.iz);
            if (x(e = n.x, o = n.z, .55)) return null;
        }
        const n = new t.Group;
        n.position.set(e, M(e), o), a.add(n);
        const i = ae();
        n.add(i.g);
        let s = null, r = null, c = null, l = null, d = null;
        const u = et.zombies[Math.floor(Math.random() * et.zombies.length)];
        if (u) try {
            const e = ot(u);
            s = nt(e, 1.9, 0, 0), n.add(s), i.g.visible = !1;
            const o = it(u), a = o.find(t => /walk|run|move|locomotion/i.test(t.name)) || o.find(t => !/idle|death|attack|hit/i.test(t.name)) || null, h = o.find(t => /idle|breath|stand/i.test(t.name)) || null;
            (a || h) && (r = new t.AnimationMixer(e), a && (c = r.clipAction(a), c.setLoop(t.LoopRepeat), c.play(), n.userData.walkCycle = a.duration || 1), 
            h && h !== a && (l = r.clipAction(h), l.setLoop(t.LoopRepeat), l.play(), l.setEffectiveWeight(c ? 0 : 1))), c || (d = function(t) {
                const e = {
                    leftLeg: null,
                    rightLeg: null,
                    leftArm: null,
                    rightArm: null
                };
                t.traverse(t => {
                    if (!t.isBone) return;
                    const o = t.name.toLowerCase();
                    !e.leftLeg && /left.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*left|leg_l|thigh_l/i.test(o) && (e.leftLeg = t), !e.rightLeg && /right.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*right|leg_r|thigh_r/i.test(o) && (e.rightLeg = t), 
                    !e.leftArm && /left.*(upperarm|arm)|(?:upperarm|arm).*left|arm_l/i.test(o) && (e.leftArm = t), !e.rightArm && /right.*(upperarm|arm)|(?:upperarm|arm).*right|arm_r/i.test(o) && (e.rightArm = t);
                });
                const o = {};
                for (const [t, n] of Object.entries(e)) n && (o[t] = n.rotation.x);
                return {
                    bones: e,
                    base: o
                };
            }(e)), console.log("Zombi:", u.animations?.map(t => t.name) || [], "Caminar:", a?.name || "procedural");
        } catch (t) {
            console.warn("Zombi básico", t), s = null, r = null, i.g.visible = !0;
        }
        const h = new t.MeshBasicMaterial({
            visible: !1
        }), p = new t.Mesh(new t.BoxGeometry(.5, .5, .5), h);
        p.position.set(0, 1.72, 0), p.userData.head = !0, n.add(p);
        const m = new t.Mesh(new t.BoxGeometry(.8, 1.35, .65), h);
        m.position.set(0, .95, 0), n.add(m);
        const f = {
            actor: n,
            basic: i,
            visual: s,
            mixer: r,
            walkAction: c,
            idleAction: l,
            procedural: d,
            hit: [ p, m ],
            hp: Rt >= 5 ? 3 : 2,
            speed: Math.min(2.6, .85 + .12 * Rt + .25 * Math.random()),
            t: 8 * Math.random(),
            attack: 0,
            groan: 3 + 5 * Math.random(),
            path: [],
            pathTimer: .5 * Math.random(),
            stuckTime: 0,
            lastX: e,
            lastZ: o,
            pathFailed: !1
        };
        return kt.push(f), f;
    }
    function re(t, e, o) {
        const n = o > 5e-4;
        if (t.mixer) {
            if (t.walkAction) {
                const e = n ? Math.max(.45, Math.min(1.7, t.speed / 1.5)) : 1;
                t.walkAction.setEffectiveTimeScale(e), t.idleAction ? (t.walkAction.setEffectiveWeight(n ? 1 : 0), t.idleAction.setEffectiveWeight(n ? 0 : 1)) : t.walkAction.setEffectiveWeight(n ? 1 : 0);
            }
            t.mixer.update(e);
        }
        if (t.procedural) {
            const {bones: e, base: o} = t.procedural, i = n ? .42 * Math.sin(t.t) : 0;
            e.leftLeg && (e.leftLeg.rotation.x = o.leftLeg + i), e.rightLeg && (e.rightLeg.rotation.x = o.rightLeg - i), e.leftArm && (e.leftArm.rotation.x = o.leftArm - .55 * i), 
            e.rightArm && (e.rightArm.rotation.x = o.rightArm + .55 * i);
        }
        if (t.visual) t.walkAction || t.procedural || (t.visual.rotation.z = n ? .04 * Math.sin(t.t) : 0, t.visual.rotation.x = n ? .025 * Math.sin(.5 * t.t) : 0); else {
            const e = n ? Math.sin(t.t) : 0;
            t.basic.legs[0].rotation.x = .5 * e, t.basic.legs[1].rotation.x = .5 * -e, t.basic.arms[0].rotation.x = -.6 - .2 * e, 
            t.basic.arms[1].rotation.x = .2 * e - .6;
        }
    }
    function ce(t, e) {
        const o = r.position.x, n = r.position.z, i = t.actor.position.x, a = t.actor.position.z, s = Math.hypot(o - i, n - a);
        if (s <= 1.15) return t.path = [], t.stuckTime = 0, 0;
        let c = o, l = n;
        if (v(i, a, o, n, B)) t.path = [], t.pathFailed = !1; else {
            if (t.pathTimer -= e, t.pathTimer <= 0 && Qt < 2) {
                Qt++, t.pathTimer = 1 + .6 * Math.random();
                const e = K(i, a, o, n);
                e ? (t.path = e, t.pathFailed = !1) : (t.path = [], t.pathFailed = !0);
            }
            for (;t.path.length && Math.hypot(t.path[0].x - i, t.path[0].z - a) < .65; ) t.path.shift();
            t.path.length && (c = t.path[0].x, l = t.path[0].z);
        }
        const d = c - i, u = l - a, h = Math.hypot(d, u);
        let p = 0;
        if (h > .03) {
            const o = Math.min(t.speed * e, h), n = i + d / h * o, s = a + u / h * o;
            let r = i, c = a;
            v(i, a, n, a, B) && (r = n), v(r, a, r, s, B) && (c = s), r === i && c === a && v(i, a, n, s, B) && (r = n, c = s), 
            t.actor.position.x = r, t.actor.position.z = c, t.actor.position.y = M(r), p = Math.hypot(r - i, c - a);
            const l = p > 5e-4 ? r - i : d, m = p > 5e-4 ? c - a : u;
            let f = Math.atan2(l, m) - t.actor.rotation.y;
            f = Math.atan2(Math.sin(f), Math.cos(f)), t.actor.rotation.y += f * Math.min(1, 9 * e);
        }
        if (p < .003 && s > 1.5 ? t.stuckTime += e : t.stuckTime = Math.max(0, t.stuckTime - 2 * e), t.stuckTime > 1.3 && !t.pathFailed && (t.pathTimer = Math.min(t.pathTimer, .2)), 
        t.stuckTime > 7) {
            const e = H();
            if (e) t.actor.position.set(e.x, M(e.x, e.z), e.z), t.path = [], t.pathTimer = 0, t.pathFailed = !1, t.stuckTime = 0, 
            console.warn("Zombi atascado recolocado", e); else {
                ue(t);
                const e = kt.indexOf(t);
                -1 !== e && kt.splice(e, 1), t.stuckTime = 0, console.warn("Zombi inaccesible retirado");
            }
        }
        return p;
    }
    function le() {
        Rt++, It = 4 + 3 * Rt, Nt = 0, _t = 0, Rt > 1 && (Ot += 24), ie("OLEADA " + Rt), mt("wave"), oe();
    }
    function de() {
        !Ft || Gt || Bt || 12 === Tt || Ot <= 0 || (Bt = !0, Yt = 1.15, oe(), mt("reload"));
    }
    function ue(t) {
        ht(t), a.remove(t.actor), t.mixer?.stopAllAction();
        for (const e of t.hit) e.geometry.dispose();
        t.hit[0].material.dispose();
        const e = kt.indexOf(t);
        e >= 0 && kt.splice(e, 1);
    }
    const he = new t.Raycaster, pe = new t.Raycaster, me = new t.Vector3, fe = new t.Vector3, ge = new t.Vector3;
    function we(t) {
        return t.intersectObjects(s.children.filter(t => !t.userData.decorative), !0).find(t => !t.object.userData.decorative);
    }
    function xe() {
        if (!Ft || Gt || Bt) return;
        const e = performance.now();
        if (e - Zt < 235) return;
        if (Tt <= 0) return void de();
        Zt = e, Tt--, Jt = .13, Mt.intensity = 8, mt("shot"), a.updateMatrixWorld(!0), Ct.setFromCamera(new t.Vector2, l), 
        Ct.far = 65;
        const o = we(Ct);
        let i = Ct.intersectObjects(kt.flatMap(t => t.hit), !1)[0];
        o && (!i || o.distance < i.distance) && (i = null), ge.copy(Ct.ray.origin).addScaledVector(Ct.ray.direction, o ? o.distance : 65), 
        i && ge.copy(i.point), Mt.getWorldPosition(fe), me.subVectors(ge, fe);
        const s = me.length();
        me.normalize(), he.set(fe, me), he.far = s + .02;
        const r = we(he), c = he.intersectObjects(kt.flatMap(t => t.hit), !1)[0];
        if (c && (!r || c.distance < r.distance)) {
            const t = kt.find(t => t.hit.includes(c.object));
            t && (t.hp -= c.object.userData.head ? 3 : 1, n("hitmark").style.opacity = 1, setTimeout(() => n("hitmark").style.opacity = 0, 90), 
            t.hp <= 0 && (ue(t), Pt++, mt("zombieDeath")));
        }
        oe(), 0 === Tt && Ot > 0 && de();
    }
    function ve(t) {
        for (const e of [ "main", "options", "load", "credits" ]) n(e + "-panel")?.classList.toggle("hidden", e !== t);
    }
    function ye() {
        n("menu")?.classList.remove("hidden"), ve("main");
    }
    function Me() {
        n("menu")?.classList.add("hidden");
    }
    const be = "deadzone-save-v3";
    function Ae() {
        try {
            const t = JSON.parse(localStorage.getItem(be));
            return 3 === t?.version && Array.isArray(t.slots) ? t.slots : [];
        } catch {
            return [];
        }
    }
    function ze() {
        return {
            sector: "olivo-80-v1",
            mode: c.mode,
            hp: Dt,
            ammo: Tt,
            reserve: Ot,
            wave: Rt,
            kills: Pt,
            remaining: It,
            spawnWait: Nt,
            between: _t,
            reloading: Bt,
            reloadLeft: Yt,
            x: r.position.x,
            y: r.position.y,
            z: r.position.z,
            yaw: Ut,
            pitch: jt,
            vy: Wt,
            grounded: qt,
            map: g.map(t => ({
                ...t
            })),
            buildings: s.children.filter(t => t.userData.building).map(t => ({
                x: t.position.x,
                z: t.position.z,
                h: t.userData.height
            })),
            cars: y.map(t => ({
                x: t.g.position.x,
                z: t.g.position.z,
                rot: t.g.rotation.y
            })),
            zombies: kt.map(t => ({
                x: t.actor.position.x,
                z: t.actor.position.z,
                hp: t.hp,
                speed: t.speed,
                attack: t.attack,
                groan: t.groan
            })),
            date: Date.now()
        };
    }
    function Se(t) {
        return t && [ "waves", "explore" ].includes(t.mode) && [ t.hp, t.ammo, t.reserve, t.wave, t.kills, t.x, t.z, t.yaw, t.pitch ].every(Number.isFinite) && t.hp > 0 && t.hp <= 100 && t.ammo >= 0 && t.ammo <= 12 && t.reserve >= 0 && t.reserve <= 1e5 && t.wave >= 0 && t.wave <= 1e4 && Math.abs(t.x) < 88 && Math.abs(t.z) < 88 && Array.isArray(t.zombies) && t.zombies.length <= 12 && t.zombies.every(t => [ t.x, t.z, t.hp, t.speed ].every(Number.isFinite) && t.hp > 0 && t.speed > 0 && t.speed <= 3 && Math.abs(t.x) < 88 && Math.abs(t.z) < 88);
    }
    function Le(t = !0) {
        if (Ft) try {
            const e = ze(), o = Ae().filter(t => t.mode !== e.mode);
            o.unshift(e), localStorage.setItem(be, JSON.stringify({
                version: 3,
                slots: o
            })), t && ie("PARTIDA GUARDADA");
        } catch {
            t && ie("NO SE PUDO GUARDAR");
        }
    }
    function ke() {
        try {
            const t = d.domElement.requestPointerLock?.();
            t?.catch(() => {
                Gt = !0, ye(), ie("CLIC EN CONTINUAR PARA JUGAR");
            });
        } catch {
            Gt = !0, ye();
        }
    }
    function Ee(t = "explore", e = null) {
        if ($) {
            Kt++, ht();
            for (const t of [ ...kt ]) ue(t);
            if (Object.keys(Lt).forEach(t => Lt[t] = !1), c.mode = t, Dt = 100, Tt = 12, Ot = 96, Rt = 0, Pt = 0, It = 0, 
            Nt = 0, _t = 0, Ut = 0, jt = 0, Wt = 0, qt = !0, Bt = !1, Yt = 0, Ft = !0, Gt = !1, Vt = !1, te = !1, Zt = 0, 
            Jt = 0, r.position.set(0, M(0), 30), r.visible = !0, n("hud").classList.remove("hidden"), e && Se(e)) {
                if ("olivo-80-v1" === e.sector && Array.isArray(e.map) && e.map.length === g.length && e.map.every(t => [ t.x, t.z, t.w, t.d, t.h ].every(Number.isFinite) && t.w > 0 && t.d > 0)) {
                    g.splice(0, g.length, ...e.map.map(t => ({
                        ...t
                    })));
                    for (const t of e.buildings || []) {
                        const e = s.children.find(e => e.userData.building && e.position.x === t.x && e.position.z === t.z);
                        if (e && t.h >= 9 && t.h <= 21) {
                            const o = t.h / e.userData.height;
                            e.scale.y *= o, e.userData.height = t.h;
                        }
                    }
                    (e.cars || []).forEach((t, e) => {
                        y[e] && [ t.x, t.z, t.rot ].every(Number.isFinite) && (y[e].g.position.set(t.x, 0, t.z), y[e].g.rotation.y = t.rot);
                    }), W();
                }
                Dt = e.hp, Tt = e.ammo, Ot = e.reserve, Rt = e.wave, Pt = e.kills, It = Math.max(0, Math.min(1e5, Number(e.remaining) || 0)), 
                Nt = Math.max(0, Number(e.spawnWait) || 0), _t = Math.max(0, Number(e.between) || 0), Ut = e.yaw, jt = Math.max(-1.2, Math.min(1.2, e.pitch)), 
                x(e.x, e.z) || r.position.set(e.x, Math.max(M(e.x, e.z), Number(e.y) || 0), e.z), Wt = Number.isFinite(e.vy) ? e.vy : 0, 
                qt = !!e.grounded, Bt = !!e.reloading, Yt = Math.max(0, Math.min(1.15, Number(e.reloadLeft) || 0));
                for (const o of e.zombies) {
                    if (x(o.x, o.z, .48)) {
                        "waves" === t && It++;
                        continue;
                    }
                    const e = se(o.x, o.z);
                    e && (e.hp = o.hp, e.speed = o.speed, e.attack = Math.max(0, Number(o.attack) || 0), e.groan = Math.max(1, Number(o.groan) || 1));
                }
            } else "waves" === t ? le() : (It = 6, ie("DÍA 47 · ZONA DE PRUEBAS"));
            $t = 0, n("continue").textContent = "CONTINUAR", n("subtitle").textContent = "LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.", 
            Me(), oe(), ut(), Re(1, !0), ke();
        } else n("loading").textContent = "ESPERA · RECURSOS EN CARGA";
    }
    function Ce() {
        ht(), mt("death"), Ft = !1, Gt = !1, Vt = !1, te = !1, document.exitPointerLock?.(), ye(), n("hud").classList.add("hidden"), 
        n("subtitle").textContent = `HAS CAÍDO · ${Pt} BAJAS`, n("continue").textContent = "REINTENTAR";
    }
    n("new").onclick = () => Ee("explore"), n("waves").onclick = () => Ee("waves"), n("continue").onclick = function() {
        if (!Ft) {
            const t = Ae().find(Se);
            return void (t ? Ee(t.mode, t) : Ee(c.mode));
        }
        Me(), n("subtitle").textContent = "LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.", ut(), ke();
    }, n("options").onclick = () => ve("options"), n("credits").onclick = () => ve("credits"), n("load").onclick = () => {
        ve("load");
        const t = n("saves");
        t.replaceChildren();
        const e = Ae().filter(Se);
        try {
            const t = JSON.parse(localStorage.getItem("deadzone-save"));
            if (t && [ t.hp, t.ammo, t.reserve, t.wave, t.kills, t.x, t.z ].every(Number.isFinite)) {
                const o = {
                    ...t,
                    mode: "waves",
                    yaw: 0,
                    pitch: 0,
                    zombies: [],
                    remaining: 4 + 3 * t.wave,
                    date: 0
                };
                Se(o) && e.push(o);
            }
        } catch {}
        for (const o of e) {
            const e = document.createElement("button");
            e.textContent = `${ee[o.mode].title} · ${o.date ? new Date(o.date).toLocaleString() : "GUARDADO V5 · REINICIA OLEADA"}`, 
            e.onclick = () => Ee(o.mode, o), t.append(e);
        }
        e.length || (t.textContent = "SIN PARTIDAS GUARDADAS");
    }, document.querySelectorAll(".back").forEach(t => t.onclick = () => ve("main"));
    for (const t of [ "fov", "sens", "vol" ]) {
        const e = n(t);
        e && (e.oninput = () => {
            n(t + "-val") && (n(t + "-val").textContent = e.value + ("vol" === t ? "%" : ""));
        });
    }
    n("apply").onclick = () => {
        l.fov = Number(n("fov").value), l.updateProjectionMatrix(), Ht = Number(n("sens").value), rt = Number(n("vol").value) / 100, 
        ct && (ct.volume = .38 * rt), gt();
        try {
            localStorage.setItem("deadzone-options", JSON.stringify({
                fov: l.fov,
                sensitivity: Ht,
                volume: rt,
                quality: n("quality").value
            }));
        } catch {}
        u.shadow.mapSize.set("high" === n("quality").value ? 2048 : 1024, "high" === n("quality").value ? 2048 : 1024), 
        u.shadow.map?.dispose(), u.shadow.map = null, d.setPixelRatio(Math.min(devicePixelRatio, "low" === n("quality").value ? .7 : "high" === n("quality").value ? 1.3 : 1));
        for (const t of [ "fov", "sens", "vol" ]) n(t + "-val").textContent = n(t).value + ("vol" === t ? "%" : "");
        ve("main");
    }, document.addEventListener("keydown", t => {
        Lt[t.code] = !0, "KeyR" === t.code && de(), "Space" === t.code && Ft && !Gt && qt && (Wt = 6, qt = !1), "F7" === t.code && (t.preventDefault(), 
        At = (At + 1) % zt.length, St(), ie("PISTOLA: ORIENTACIÓN " + (At + 1) + "/8")), "KeyP" === t.code && Ft && !Gt && Le(), 
        Ft && [ "Space", "ArrowUp", "ArrowDown" ].includes(t.code) && t.preventDefault();
    }), document.addEventListener("keyup", t => {
        Lt[t.code] = !1;
    }), document.addEventListener("mousemove", t => {
        document.pointerLockElement === d.domElement && (Ut -= t.movementX * Ht * .01, jt = Math.max(-1.45, Math.min(1.45, jt - t.movementY * Ht * .01)));
    }), d.domElement.addEventListener("mousedown", t => {
        2 !== t.button ? Ft && !Gt && 0 === t.button && (Vt = !0, document.pointerLockElement !== d.domElement ? d.domElement.requestPointerLock?.() : xe()) : te = Ft && !Gt;
    }), document.addEventListener("mouseup", t => {
        0 === t.button && (Vt = !1), 2 === t.button && (te = !1);
    }), d.domElement.addEventListener("contextmenu", t => t.preventDefault()), document.addEventListener("pointerlockchange", () => {
        if (Ft) if (document.pointerLockElement === d.domElement) Gt = !1, Me(), wt(); else {
            Gt = !0, Vt = !1, te = !1, ht(), wt(), Object.keys(Lt).forEach(t => Lt[t] = !1), Le(!1), ye();
            const t = n("menu")?.querySelector(".subtitle");
            t && (t.textContent = "PARTIDA EN PAUSA");
        }
    }), window.addEventListener("blur", () => {
        Vt = !1, te = !1, Ft && (Gt = !0, ht(), xt(), Le(!1), document.exitPointerLock?.(), ye()), Object.keys(Lt).forEach(t => {
            Lt[t] = !1;
        });
    });
    const De = {
        visual: null,
        mixer: null,
        walk: null,
        idle: null,
        run: null,
        current: null
    }, Te = ae();
    async function Oe() {
        const e = await X.loadAsync("https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Soldier.glb"), o = ot(e);
        De.visual = nt(o, 1.8), De.visual.rotation.y = Math.PI, r.add(De.visual), o.traverse(t => {
            if (t.isMesh) {
                t.castShadow = !0;
                for (const e of Array.isArray(t.material) ? t.material : [ t.material ]) e.roughness = .92;
            }
        }), De.mixer = new t.AnimationMixer(o);
        const i = it(e), a = t => {
            const e = i.find(e => e.name.toLowerCase() === t);
            if (!e) throw Error("Falta animación " + t);
            return De.mixer.clipAction(e);
        };
        De.idle = a("idle"), De.walk = a("walk"), De.run = a("run"), De.current = De.idle, De.idle.play(), Te.g.visible = !1, 
        n("asset-status").textContent = "HUMANO · IDLE / WALK / RUN";
    }
    function Re(e, o = !1) {
        const n = !(!Lt.ControlLeft && !Lt.KeyC), i = c.moving;
        if (r.rotation.y = Ut, De.mixer) {
            const t = i ? Lt.ShiftLeft && !n ? De.run : De.walk : De.idle;
            t !== De.current && (De.current.fadeOut(.2), t.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(.2).play(), 
            De.current = t), t.timeScale = n ? .65 : 1, De.mixer.update(e);
        }
        if (De.visual && (De.visual.position.y = 0), !De.visual) {
            const t = i ? .45 * Math.sin(.009 * performance.now()) : 0;
            Te.legs[0].rotation.x = t, Te.legs[1].rotation.x = -t;
        }
        vt.position.set(.3, n ? .94 : 1.24, -.38 + Jt), vt.rotation.set(te ? jt : 0, 0, 0);
        const a = new t.Vector3(r.position.x, r.position.y + (n ? 1.05 : 1.5), r.position.z), d = (new t.Quaternion).setFromEuler(new t.Euler(jt, Ut, 0, "YXZ")), u = new t.Vector3(te ? .48 : .65, .12, te ? 1.9 : 3.5).applyQuaternion(d), h = a.clone().add(u);
        s.updateMatrixWorld(!0), pe.set(a, u.clone().normalize()), pe.far = u.length() + .15;
        const p = we(pe);
        p && h.copy(a).addScaledVector(pe.ray.direction, Math.max(.15, p.distance - .22)), o ? l.position.copy(h) : l.position.lerp(h, 1 - Math.exp(14 * -e)), 
        me.subVectors(l.position, a), pe.set(a, me.clone().normalize()), pe.far = me.length();
        const m = we(pe);
        m && l.position.copy(a).addScaledVector(pe.ray.direction, Math.max(.12, m.distance - .22)), l.quaternion.copy(d), 
        r.visible = a.distanceTo(l.position) > .6;
    }
    function Pe(t) {
        t.scene.traverse(t => {
            if (t.isMesh) for (const e of Array.isArray(t.material) ? t.material : [ t.material ]) for (const t of [ "map", "normalMap", "roughnessMap", "metalnessMap", "aoMap" ]) {
                const o = e[t], n = o?.image;
                if (n && !o.userData.reduced && (o.userData.reduced = !0, Math.max(n.width, n.height) > 512)) {
                    const t = document.createElement("canvas"), e = 512 / Math.max(n.width, n.height);
                    t.width = Math.max(1, Math.round(n.width * e)), t.height = Math.max(1, Math.round(n.height * e)), t.getContext("2d").drawImage(n, 0, 0, t.width, t.height), 
                    o.image = t, o.needsUpdate = !0;
                }
            }
        });
    }
    r.add(Te.g), Te.g.traverse(t => {
        t.isMesh && (t.material = h(t.position.y > 1.4 ? 10058340 : 4541767));
    });
    const Ie = t => "https://raw.githubusercontent.com/FliickzzzZ/Modelos-3d-Juego-Chromebook/deadzone/art-street-80m/deadzone/assets/" + t;
    async function Ne(e, o, n, i, a) {
        const s = new t.TextureLoader, r = await Promise.all([ o, n, i ].map(t => t ? s.loadAsync(Ie(t)) : null));
        for (let e = 0; e < r.length; e++) {
            const o = r[e];
            o && (o.wrapS = o.wrapT = t.RepeatWrapping, o.repeat.set(...a), o.anisotropy = 2, 0 === e && (o.colorSpace = t.SRGBColorSpace));
        }
        e.map = r[0], e.normalMap = r[1], e.normalScale.set(.45, .45), e.roughnessMap = r[2], e.metalness = 0, e.roughness = .97, 
        e.needsUpdate = !0;
    }
    async function _e() {
        const e = [ "Building_Small_1", "Building_Medium_2_001" ];
        for (let o = 0; o < 2; o++) {
            const n = nt(ot(await X.loadAsync(Ie(e[o] + ".glb"))), o ? 21 : 17);
            n.rotation.y = o ? -Math.PI / 2 : Math.PI / 2, n.position.set(o ? 13 : -13, .22, o ? -13 : 3), n.userData.building = !0, 
            n.userData.height = o ? 21 : 17, n.userData.asset = e[o], s.add(n), n.traverse(t => {
                t.isMesh && (t.castShadow = !0, t.receiveShadow = !0);
            }), n.updateMatrixWorld(!0);
            const i = (new t.Box3).setFromObject(n), a = i.getSize(new t.Vector3), r = i.getCenter(new t.Vector3);
            Object.assign(g[o], {
                x: r.x,
                z: r.z,
                w: a.x,
                d: a.z,
                h: a.y
            });
        }
        await Promise.all([ Ne(m.road, "T_Concrete_Asphalt_BaseColor.png", "T_Concrete_Normal.png", "T_Concrete_ORM.png", [ 2, 16 ]), Ne(m.walk, "T_Concrete_BaseColor.png", "T_Concrete_Normal.png", "T_Concrete_ORM.png", [ 3, 20 ]), Ne(m.ground, "T_Dirt_BaseColor.png", "T_Dirt_Normal.png", "T_Dirt_ORM.png", [ 8, 16 ]) ]), 
        await async function() {
            const e = await Promise.all([ "tree", "shrub", "grass" ].map(t => X.loadAsync(Ie(t + ".glb"))));
            function o(e, o, n = !1) {
                e.scene.updateMatrixWorld(!0), e.scene.traverse(e => {
                    if (!e.isMesh) return;
                    const i = new t.InstancedMesh(e.geometry, e.material, o.length);
                    i.userData.decorative = !(n && "bark" === e.material.name), i.receiveShadow = !0;
                    for (let n = 0; n < o.length; n++) {
                        const a = o[n], s = (new t.Quaternion).setFromEuler(new t.Euler(0, a.r || 0, 0));
                        P.compose(new t.Vector3(a.x, a.y || .22, a.z), s, new t.Vector3(a.s || 1, a.s || 1, a.s || 1)), P.multiply(e.matrixWorld), 
                        i.setMatrixAt(n, P);
                    }
                    i.computeBoundingSphere(), s.add(i);
                });
            }
            const n = [ {
                x: -7.5,
                z: 25,
                s: 1
            }, {
                x: 7.5,
                z: 8,
                s: .85
            }, {
                x: -7.7,
                z: -24,
                s: 1.2
            }, {
                x: 8,
                z: -35,
                s: .8
            } ];
            o(e[0], n, !0);
            for (const t of n) w(t.x, t.z, .65, .65, 6);
            const i = [], a = [];
            for (let t = 0; t < 65; t++) i.push({
                x: (E() > .5 ? 1 : -1) * (7 + 1.1 * E()),
                z: 77 * (E() - .5),
                s: .55 + .5 * E(),
                r: 6 * E()
            });
            for (let t = 0; t < 380; t++) a.push({
                x: (E() > .5 ? 1 : -1) * (4.35 + 1.2 * E()),
                z: 79 * (E() - .5),
                s: .6 + .9 * E(),
                r: 6 * E()
            });
            for (let t = 0; t < 100; t++) a.push({
                x: 8.8 * (E() - .5),
                z: 76 * (E() - .5),
                s: .25 + .55 * E(),
                r: 6 * E(),
                y: .06
            });
            o(e[1], i), o(e[2], a);
            const r = [];
            for (const t of [ -1, 1 ]) for (let e = 0; e < 34; e++) r.push({
                x: 6.88 * t,
                z: (t < 0 ? 3 : -13) + 11 * (E() - .5),
                y: .5 + 10 * E(),
                s: .35 + .6 * E(),
                r: 6 * E()
            });
            o(e[1], r);
        }(), W(), tt = !0, n("city-status").textContent = "CALLE DEL OLIVO · 80 M · 2 EDIFICIOS COMPLETOS";
    }
    let Fe = 0, Ge = 0;
    window.addEventListener("resize", () => {
        const t = Math.max(1, i.clientWidth), e = Math.max(1, i.clientHeight);
        l.aspect = t / e, l.updateProjectionMatrix(), d.setSize(t, e);
    });
    try {
        const t = JSON.parse(localStorage.getItem("deadzone-options"));
        t && (n("fov").value = t.fov, n("sens").value = t.sensitivity, n("vol").value = 100 * t.volume, n("quality").value = t.quality);
    } catch {}
    n("apply").onclick(), i.addEventListener("click", () => {
        st || ut();
    }, {
        once: !0
    }), window.addEventListener("pagehide", () => {
        Le(!1), ht(), xt();
    }), new URLSearchParams(location.search).has("test") && (window.__DZ = {
        scene: a,
        world: s,
        player: r,
        camera: l,
        hero: De,
        assets: et,
        zombies: kt,
        solids: g,
        blocked: x,
        clearLine: v,
        findPath: K,
        spawnZombie: se,
        removeZombie: ue,
        start: Ee,
        shoot: xe,
        reload: de,
        snapshot: ze,
        validSave: Se,
        saveGame: Le,
        readSaves: Ae,
        getState: () => ({
            hp: Dt,
            ammo: Tt,
            reserve: Ot,
            wave: Rt,
            kills: Pt,
            remaining: It,
            paused: Gt,
            reloading: Bt,
            reloadLeft: Yt,
            mode: c.mode
        }),
        setPaused: t => Gt = t,
        setYaw: t => Ut = t,
        updatePlayerCamera: Re,
        activeSounds: lt,
        sound: mt,
        stopSounds: ht,
        moveZombie: ce,
        wakeAudio: ut,
        getPathBudget: () => Qt
    }), oe(), function t() {
        requestAnimationFrame(t);
        const e = Et.getDelta(), o = Math.min(e, .05);
        if (Qt = 0, Ft && !Gt) {
            const t = Number(!!Lt.KeyW) - Number(!!Lt.KeyS), e = Number(!!Lt.KeyD) - Number(!!Lt.KeyA), i = Math.hypot(t, e) || 1, a = (Lt.ControlLeft || Lt.KeyC ? 2.2 : Lt.ShiftLeft ? 7 : 4.5) * o, s = (-Math.sin(Ut) * t + Math.cos(Ut) * e) / i * a, l = (-Math.cos(Ut) * t - Math.sin(Ut) * e) / i * a;
            v(r.position.x, r.position.z, r.position.x + s, r.position.z, .38) && (r.position.x += s), v(r.position.x, r.position.z, r.position.x, r.position.z + l, .38) && (r.position.z += l), 
            c.moving = !(!t && !e), Wt -= 15 * o, r.position.y += Wt * o;
            const u = M(r.position.x, r.position.z);
            if (r.position.y <= u ? (r.position.y = u, Wt = 0, qt = !0) : qt = !1, Re(o), function(t) {
                if (Bt && (Yt -= t, Yt <= 0)) {
                    const t = Math.min(12 - Tt, Ot);
                    Tt += t, Ot -= t, Bt = !1, Yt = 0, oe();
                }
            }(o), gt(), $t += o, $t > 20 && (Le(!1), $t = 0), (t || e) && qt && (Xt -= o, Xt <= 0 && (mt("step"), Xt = Lt.ShiftLeft ? .32 : .48)), 
            Nt -= o, It > 0 && Nt <= 0 && kt.length < ee[c.mode].limit) {
                const t = H();
                if (t) {
                    se(t.x, t.z) && It--;
                }
                Nt = 1.15;
            }
            "waves" === c.mode && 0 === It && 0 === kt.length ? (_t += o, _t > 2 && le()) : _t = 0;
            for (const t of [ ...kt ]) {
                const e = ce(t, o);
                if (!kt.includes(t)) continue;
                t.t += o * (e > 5e-4 ? 7 : 2), re(t, o, e);
                const i = r.position.x - t.actor.position.x, a = r.position.z - t.actor.position.z, s = Math.hypot(i, a);
                if (t.attack -= o, t.groan -= o, t.groan <= 0 && s < 15 && (mt("zombie", t), t.groan = 5 + 5 * Math.random()), 
                s < 1.2 && Math.abs(r.position.y - t.actor.position.y) < 1.5 && t.attack <= 0 && v(t.actor.position.x, t.actor.position.z, r.position.x, r.position.z, .1) && (Dt -= 12, 
                t.attack = 1.1, Dt > 0 && mt("hurt"), n("damage") && (n("damage").style.opacity = .3, setTimeout(() => {
                    n("damage").style.opacity = 0;
                }, 150)), oe(), Dt <= 0)) {
                    Ce();
                    break;
                }
            }
            Vt && document.pointerLockElement === d.domElement && xe(), Jt = Math.max(0, Jt - 1.1 * o), Mt.intensity = Math.max(0, Mt.intensity - 120 * o);
        }
        if (Fe++, Ge += e, Ge >= 1 && (n("fps") && (n("fps").textContent = n("showfps")?.checked ? Fe + " FPS" : ""), 
        Fe = 0, Ge = 0), !Ft) {
            r.visible = !0, vt.position.set(.3, 1.24, -.38), r.rotation.y = -.5, De.mixer && De.mixer.update(o);
            const t = 6e-5 * performance.now();
            l.position.set(r.position.x + 4 + 1.2 * Math.sin(t), r.position.y + 2.1, r.position.z + 5), l.lookAt(r.position.x, r.position.y + 1, r.position.z);
        }
        n("mode-name") && (n("mode-name").textContent = ee[c.mode].title), d.render(a, l);
    }(), async function() {
        const e = [ Oe().catch(t => {
            console.warn("Personaje provisional geométrico", t), n("asset-status").textContent = "PERSONAJE BÁSICO · FALLÓ EL GLB";
        }), _e().catch(t => {
            console.warn("MegaKit no disponible", t), n("city-status").textContent = "FALLO DE CARGA · CALLE INCOMPLETA";
        }) ];
        for (const t of [ "Zombies/zombie_1.glb", "Zombies/zombie_2.glb" ]) try {
            const e = await Q(t);
            Pe(e), et.zombies.push(e);
        } catch (e) {
            console.warn(t, e);
        }
        for (const t of [ ...kt ]) if (!t.visual && et.zombies.length) {
            const e = {
                x: t.actor.position.x,
                z: t.actor.position.z,
                hp: t.hp,
                speed: t.speed
            };
            ue(t);
            const o = se(e.x, e.z);
            o && (o.hp = e.hp, o.speed = e.speed);
        }
        try {
            et.gun = await Q("Armas 3D/pistola/9_mm.glb"), Pe(et.gun), function(e) {
                bt && vt.remove(bt);
                const o = ot(e);
                bt = new t.Group, vt.add(bt), bt.position.set(0, 0, -.08), bt.add(nt(o, .23, .32, .6)), yt.visible = !1, St();
            }(et.gun);
        } catch (t) {
            console.warn("Pistola básica", t);
        }
        try {
            et.car = await Q("Armas 3D/coche/covered_car_4k.glb");
            const e = await (new t.TextureLoader).loadAsync(Ie("car-diffuse.jpg"));
            e.colorSpace = t.SRGBColorSpace, e.flipY = !1, et.car.scene.traverse(t => {
                if (t.isMesh) {
                    t.castShadow = !0, t.receiveShadow = !0;
                    for (const o of Array.isArray(t.material) ? t.material : [ t.material ]) o.map = e, o.roughness = .95, o.metalness = .15, 
                    o.needsUpdate = !0;
                }
            });
            for (const t of y) t.g.add(nt(ot(et.car), 1.5, 2.1, 4.3)), t.low.visible = !1;
        } catch (t) {
            console.warn("Coche básico", t);
        }
        await Promise.allSettled(e), $ = tt && !!De.visual, n("loading").textContent = $ ? "LISTO · P PARA GUARDAR" : "ERROR · RECURSOS VISUALES INCOMPLETOS";
    }().catch(console.error), console.log("DEAD ZONE · FASE 1 · TERCERA PERSONA");
})().catch(t => {
    console.error(t);
    const e = document.getElementById("loading");
    e && (e.textContent = "NO SE PUDO INICIAR · " + t.message);
});