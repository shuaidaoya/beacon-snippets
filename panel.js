// 面板片段：独立部署，与代理片段互斥（靠片段规则表达式分流，见 README）
// 部署前修改以下常量
const PANEL_PATH = '/pa-x7k9';                                       // 秘密路径，务必修改并与片段规则表达式一致
const PANEL_KEY = 'beacon';                                          // 访问口令，务必修改
const PANEL_URL = 'https://shuaidaoya.github.io/beacon-snippets/panel.html'; // 面板页面地址，GitHub Pages 或 Cloudflare Pages 均可
const UUID = 'f5e83536-5a6c-457d-b113-e8f06d0542ba';                   // 与 snippet.js 的 V2 一致
const FDIP = 'ProxyIP.SG.CMLiussss.net';                             // 与 snippet.js 的 V1 一致

const b64d = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); s += '===='.slice(0, (4 - s.length % 4) % 4); return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };

export default {
  async fetch(rq) {
    const u = new URL(rq.url);
    if (rq.headers.get('Upgrade')) return fetch(rq);
    // 订阅解码：/s/{base64url(订阅内容)}，数据全在 URL 里，服务端零存储
    if (u.pathname.startsWith(PANEL_PATH + '/s/')) {
      try {
        return new Response(b64d(u.pathname.slice(PANEL_PATH.length + 3)), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
      } catch { return new Response('Not Found', { status: 404 }); }
    }
    if (u.pathname !== PANEL_PATH && u.pathname !== PANEL_PATH + '/') return fetch(rq);
    const k = u.searchParams.get('key');
    const ok = k === PANEL_KEY || (rq.headers.get('Cookie') || '').includes('pk=' + PANEL_KEY);
    if (!ok) return new Response('Not Found', { status: 404 });
    const html = await (await fetch(PANEL_URL, { cf: { cacheTtl: 300, cacheEverything: true } })).text();
    const cfg = { host: u.host, path: PANEL_PATH, uuid: UUID, fdip: FDIP, ssMethod: 'aes-128-gcm' };
    const res = new Response(html.replace('/*__CFG__*/{}', JSON.stringify(cfg)), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    if (k === PANEL_KEY) res.headers.append('Set-Cookie', `pk=${PANEL_KEY}; Path=${PANEL_PATH}; HttpOnly; Secure; SameSite=Lax`);
    return res;
  }
};
