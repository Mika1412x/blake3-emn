"use strict";
const blake3Js = require("./function");
function utf8ToBytes(e) {
  for (var t, n = [], r = e.length, u = 0, i = 0; i < r; ++i)
    (t = e.charCodeAt(i)) < 128
      ? (n[u++] = t)
      : t < 2048
      ? ((n[u++] = 192 | (t >>> 6)), (n[u++] = 128 | (63 & t)))
      : t < 55296 || t >= 57344
      ? ((n[u++] = 224 | (t >>> 12)),
        (n[u++] = 128 | ((t >>> 6) & 63)),
        (n[u++] = 128 | (63 & t)))
      : ((t = 65536 + (((1023 & t) << 10) | (1023 & e.charCodeAt(++i)))),
        (n[u++] = 240 | (t >>> 18)),
        (n[u++] = 128 | ((t >>> 12) & 63)),
        (n[u++] = 128 | ((t >>> 6) & 63)),
        (n[u++] = 128 | (63 & t)));
  return n;
}
exports.init = function () {
  function e(e) {
    return "string" == typeof e ? utf8ToBytes(e) : e;
  }
  function t(t, n) {
    var r = n;
    if ("hash" === r) return blake3Js.newRegular();
    if ("keyed_hash" === r) {
      if (32 !== t.length)
        throw new Error("key must be 32 bytes.");
      return blake3Js.newKeyed(t);
    }
    return blake3Js.newDeriveKey(e(t));
  }
  function n(t, n, r) {
    (r = r || 256), t.update(e(n));
    var u = {
      update: function (n) {
        return t.update(e(n)), u;
      },
      hex: function () {
        return t.finalize(r / 8);
      },
    };
    return u;
  }
  function r(e, r, u, i) {
    return n(t(u, i), e, r);
  }
  var u = function (e, t, n, u) {
    return r(e, t, n, u).hex();
  };
  return (u.update = r), u;
};
