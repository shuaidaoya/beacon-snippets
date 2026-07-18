## 前排劝退
**无前端，无订阅，需手搓节点，订阅功能可自行搭配 EDT 或订阅器实现。**  
**仅适合对CF节点有一定基础的同学，至少得会用节点模板修改节点信息。**  

---
## 文件说明
* `snippet.js`：vless/trojan/shadowsocks 三协议，支持 `!txt` + `socks5` + `http` + `https` + `sstp` + `turn` 功能，此 https 非完全体。  
* `worker.js`：vless/trojan/shadowsocks 三协议，支持 `!txt` + `socks5` + `http` + `https` + `sstp` + `turn` 功能，此 https 为完全体。  
* `!txt+https.js`：vless 单协议，支持 `!txt` + `https` 功能，此 https 为完全体。  
* `!txt+https_ss.js`：shadowsocks 单协议，支持 `!txt` + `https` 功能，此 https 为完全体。  
* `panel.js` + `panel.html`：可选的外链面板（节点生成器），独立片段部署，见下方说明。  

_注：ss 建议用 notls。_  

---
## 功能说明
1. **!txt**：通过标记 `!txt` 支持采用 TXT 记录的反代域名、https等协议代理域名，比如威廉维护的反代域名 [*.william.us.ci!txt](https://t.me/CMLiussss_channel/84)、https://https.example.com!txt  
2. **socks**：略  
3. **http**：略  
4. **https**：完全体支持 `https://host:port` 和 `https://ip:port!ip`，非完全体仅支持 `https://host:port`，见 [AK说明](https://t.me/Enkelte_notif/817)  
5. **sstp**：小日子大学的个人志愿者公益家宽，见 [AK说明](https://t.me/Enkelte_notif/819)  
6. **turn**：见 [AK说明](https://t.me/Enkelte_notif/805)  
7. **global**：协议代理（socks5等）默认全局模式，?global=0 时关闭全局模式，采用回落模式。  

**总结**：这些功能解决的是CF节点的落地问题，可以实现**无限家宽全球落地**。  
**另注**：TXT 内容格式以 `,` 分隔或换行或两者混用。作用逻辑：获取域名 TXT 记录内容，取其中某个反代 ip:port 或协议代理如 sstp://host:port 使用。  

**路径示例：**
```
1. !txt：
/fdip=*.william.us.ci!txt?ed=2560
/fdip={any}://https.example.com!txt?ed=2560
2. socks：
/fdip=socks5://host:port?ed=2560
3. http：
/fdip=http://host:port?ed=2560
4. https：
/fdip=https://domain:port?ed=2560
/fdip=https://ip:port!ip?ed=2560
5. sstp：
/fdip=sstp://host:port?ed=2560
6. turn：
/fdip=turn://host:port?ed=2560
7. global:
/fdip={落地}?global=0&ed=2560
```
_注意：ed=2560 放在最后_
**节点示例：**
```
vless://495c7195-85b8-498a-bf20-2ea9ce9175b5@www.shopify.com:443?path=%2Ffdip%3Dhttps%3A%2F%2F1.2.3.4%3A443%21ip%3Fed%3D2560&security=tls&encryption=none&insecure=0&host=https.snippets.cf&fp=random&type=ws&allowInsecure=0&sni=https.snippets.cf#https

trojan://495c7195-85b8-498a-bf20-2ea9ce9175b5@www.shopify.com:443?path=%2Ffdip%3Dsstp%3A%2F%2Fsstp.example.com%21txt%3Fed%3D2560&security=tls&insecure=0&host=trojan.snippet.cf&fp=chrome&type=ws&allowInsecure=0&sni=trojan.snippet.cf#sstp%21txt

ss://YWVzLTEyOC1nY206cGFzc3dvcmQ=@www.shopify.com:80/?plugin=v2ray-plugin%3Bmode%3Dwebsocket%3Bhost%3Dnotls.snippets.cf%3Bpath%3D%2Ffdip%3Dproxyip.example.com%3Fed%3D2560#notls
```

---
## 面板（可选）
**思路：代理代码零改动，新增一个独立片段做面板路由，面板页面 `panel.html` 托管在 GitHub Pages。**

**① 部署 panel.html 到 GitHub Pages（推荐）**  
1. 把仓库的 `panel.html` push 到 GitHub（你已经在做）。  
2. 仓库 **Settings → Pages → Build and deployment**：Source 选 `Deploy from a branch`，Branch 选 `main` / `(root)`，Save。  
3. 等约 1 分钟，访问 `https://你的用户名.github.io/仓库名/panel.html` 确认能打开（直接打开会是「手动模式」，正常）。  
   - 本仓库默认：`https://shuaidaoya.github.io/beacon-snippets/panel.html`

**② 新建面板片段**  
1. Cloudflare 控制台 → Rules → Snippets → Create snippet，粘贴 `panel.js`。  
2. 修改顶部常量：`PANEL_PATH`（秘密路径）、`PANEL_KEY`（口令）、`PANEL_URL`（上一步的 Pages 地址）、`UUID`、`FDIP`。  
3. 片段规则表达式（仅匹配面板路径）：`starts_with(http.request.uri.path, "/pa-x7k9")`  
4. 代理片段规则表达式**排除面板路径**（两者互斥，与执行顺序无关）：`not starts_with(http.request.uri.path, "/pa-x7k9")`  

**③ 访问**：`https://你的域名/pa-x7k9?key=口令`，首次验证后种 Cookie 免密。  

**说明：**面板口令错误一律返回 404 伪装；配置（host/UUID/默认 fdip）在口令验证后注入页面；支持生成 vless/trojan/ss 链接、二维码、base64 订阅及 `/s/{数据}` 订阅链接（数据全在 URL 里，服务端零存储）。  

_注：Snippets 需 Pro 及以上套餐；面板每次访问消耗 1 个子请求；panel.html 更新后有 5 分钟边缘缓存，想立即生效可在 Pages 部署详情页强制刷新，或在 `panel.js` 里把 `cacheTtl: 300` 改成 `0`。_

---
## 特别提醒
**若1101请全删旧片段再部署，已有正常运行中的片段需谨慎，部署新片段会触发全部片段代码检测。**  
**有问题请开 issue 或联系 [tg bot](https://t.me/meindmBot) 直奔主题**  

---
## 鸣谢
**[老王](https://github.com/eooce/Cloudflare-proxy/blob/main/snippets.js)、[CM](https://github.com/cmliu/edgetunnel)、[AK](https://github.com/ToiCF)、AI**
