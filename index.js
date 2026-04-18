import { jsx as o, jsxs as T } from "react/jsx-runtime";
import { useState as S, useRef as j, useEffect as C } from "react";
import { useViewport as A, useSettings as P } from "@mywallpaper/sdk-react";
const U = "https://api.mymemory.translated.net/get", D = {
  sourceLanguage: "fr",
  targetLanguage: "en",
  autoNextSeconds: 0,
  textScale: 100,
  cardColor: "#FFF8F0",
  textColor: "#231B14",
  transparency: 14
}, u = [
  "hello",
  "goodbye",
  "please",
  "thank you",
  "friend",
  "family",
  "water",
  "bread",
  "coffee",
  "ticket",
  "hotel",
  "map",
  "book",
  "computer",
  "project",
  "question",
  "answer",
  "train",
  "passport",
  "happy"
];
function H(r) {
  return { ...D, ...r };
}
function w(r) {
  if (u.length === 1) return u[0];
  const e = u.filter((n) => n !== r), t = e.length > 0 ? e : u;
  return t[Math.floor(Math.random() * t.length)] ?? u[0];
}
function v(r) {
  const e = r.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(e)) return e;
  if (/^#[0-9a-fA-F]{3}$/.test(e)) {
    const [, t, n, s] = e;
    return `#${t}${t}${n}${n}${s}${s}`;
  }
  return "#ffffff";
}
function q(r) {
  const e = v(r).slice(1), t = Number.parseInt(e, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
function E(r, e) {
  const { r: t, g: n, b: s } = q(r);
  return `rgba(${t}, ${n}, ${s}, ${e})`;
}
async function k(r, e) {
  if (e === "en") return r;
  const t = new URLSearchParams({
    q: r,
    langpair: `en|${e}`
  }), n = await fetch(`${U}?${t.toString()}`);
  if (!n.ok) throw new Error(`Translation request failed: ${n.status}`);
  const c = (await n.json()).responseData?.translatedText?.trim();
  if (!c) throw new Error("Empty translation response");
  return c;
}
function B() {
  const r = A(), e = P(), t = H(e), [n, s] = S(() => w(null)), [c, f] = S(null), [N, h] = S(null), b = j(/* @__PURE__ */ new Map()), a = r.width < 360 || r.height < 280, $ = t.textScale / 100, R = v(t.cardColor), l = v(t.textColor), F = Math.min(70, Math.max(0, t.transparency)) / 100, M = E(l, 0.14), W = E(R, 1 - F);
  C(() => {
    if (t.sourceLanguage === t.targetLanguage) return;
    const i = `${n}:${t.sourceLanguage}:${t.targetLanguage}`, d = b.current.get(i);
    if (d) {
      f(d), h(null);
      return;
    }
    let m = !1;
    return f(null), h(null), Promise.all([
      k(n, t.sourceLanguage),
      k(n, t.targetLanguage)
    ]).then(([g, I]) => {
      if (m) return;
      const L = { sourceText: g, targetText: I };
      b.current.set(i, L), f(L);
    }).catch((g) => {
      m || h(g instanceof Error ? g.message : "Unable to translate this word");
    }), () => {
      m = !0;
    };
  }, [n, t.sourceLanguage, t.targetLanguage]), C(() => {
    if (t.autoNextSeconds <= 0) return;
    const i = window.setTimeout(() => {
      s((d) => w(d));
    }, t.autoNextSeconds * 1e3);
    return () => window.clearTimeout(i);
  }, [n, t.autoNextSeconds]);
  const z = () => {
    s((i) => w(i));
  }, p = {
    width: "100%",
    height: "100%",
    padding: a ? 12 : 18,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
    background: "transparent"
  }, y = {
    position: "relative",
    width: "100%",
    minHeight: 0,
    display: "grid",
    alignItems: "center",
    padding: a ? "20px 18px" : "28px 24px",
    borderRadius: a ? 24 : 32,
    background: "transparent",
    border: "none",
    boxShadow: "none",
    cursor: "pointer",
    appearance: "none",
    textAlign: "center",
    overflow: "hidden"
  }, x = {
    width: "100%",
    display: "grid",
    gap: a ? 14 : 18,
    justifyItems: "center",
    padding: a ? "10px 8px" : "12px 10px",
    position: "relative",
    zIndex: 1
  };
  return t.sourceLanguage === t.targetLanguage ? /* @__PURE__ */ o("div", { style: p, children: /* @__PURE__ */ o("div", { style: { ...y, cursor: "default" }, children: /* @__PURE__ */ o("div", { style: { ...x, color: l }, children: /* @__PURE__ */ o("div", { style: { fontSize: 18, fontWeight: 700 }, children: "Choose two different languages" }) }) }) }) : N ? /* @__PURE__ */ o("div", { style: p, children: /* @__PURE__ */ o("div", { style: { ...y, cursor: "default" }, children: /* @__PURE__ */ o("div", { style: { ...x, color: l }, children: /* @__PURE__ */ o("div", { style: { fontSize: 18, fontWeight: 700 }, children: "Translation unavailable" }) }) }) }) : /* @__PURE__ */ o("div", { style: p, children: /* @__PURE__ */ T("button", { type: "button", onClick: z, style: y, children: [
    /* @__PURE__ */ o(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          borderRadius: a ? 24 : 32,
          background: W
        }
      }
    ),
    /* @__PURE__ */ T("div", { style: x, children: [
      /* @__PURE__ */ o(
        "div",
        {
          style: {
            fontSize: (a ? 30 : 42) * $,
            lineHeight: 0.95,
            fontWeight: 800,
            color: l,
            textWrap: "balance"
          },
          children: c?.sourceText ?? "..."
        }
      ),
      /* @__PURE__ */ o(
        "div",
        {
          style: {
            width: a ? 54 : 64,
            height: 1,
            margin: "0 auto",
            background: M
          }
        }
      ),
      /* @__PURE__ */ o(
        "div",
        {
          style: {
            fontSize: (a ? 24 : 34) * $,
            lineHeight: 0.98,
            fontWeight: 700,
            color: l,
            textWrap: "balance"
          },
          children: c?.targetText ?? "..."
        }
      )
    ] })
  ] }) });
}
export {
  B as default
};
