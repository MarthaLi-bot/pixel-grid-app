# 图片像素格转换器

一个使用 React + Vite + JavaScript 开发的纯前端图片像素格转换器。用户可以上传本地图片，在浏览器内通过 HTML Canvas 生成像素格效果，并导出 PNG 图片。

## 功能

- 上传一张本地图片并预览原图。
- 在右侧实时查看像素格处理结果。
- 调整像素块大小：4、8、12、16、24、32。
- 显示或隐藏网格线。
- 调整网格线颜色和粗细。
- 将处理后的图片导出为 PNG。
- 所有图片处理都在浏览器本地完成，不会上传用户图片。

## 技术栈

- React
- Vite
- JavaScript
- HTML Canvas

## 本地安装

请先确认本机已安装 Node.js 和 npm。

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

启动后，根据终端提示打开本地地址，通常是：

```text
http://localhost:5173/
```

## 构建生产版本

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

## 预览生产构建

```bash
npm run preview
```

## PWA 支持

PWA（Progressive Web App，渐进式 Web 应用）是一种让网页具备接近原生应用体验的技术组合。支持的浏览器可以读取 Web App Manifest，并配合 Service Worker 缓存基础应用外壳，让用户把站点添加到主屏幕后以独立窗口方式打开。

本项目的 PWA 支持仅用于前端静态资源和应用外壳缓存：

- 不会上传用户图片。
- 不会缓存用户通过文件选择器上传的本地图片。
- 不包含后端、数据库、登录系统、云存储或支付功能。

## 本地验收 PWA

PWA 安装能力通常要求站点运行在 `localhost` 或 HTTPS 环境中。

1. 安装依赖：

   ```bash
   npm install
   ```

2. 本地开发运行：

   ```bash
   npm run dev
   ```

   开发模式下可以验证页面功能，但 Service Worker 只会在生产构建中注册，避免影响日常开发热更新。

3. 构建生产版本：

   ```bash
   npm run build
   ```

4. 预览生产版本：

   ```bash
   npm run preview
   ```

5. 在浏览器打开终端提示的本地地址，通常是：

   ```text
   http://localhost:4173/
   ```

6. 使用浏览器开发者工具检查：

   - Application / Manifest 中能看到应用名称、图标和 `standalone` 显示模式。
   - Application / Service Workers 中能看到 `sw.js` 已注册。
   - 浏览器地址栏或菜单中出现安装提示时，可以尝试安装。

## 手机上验收 PWA

手机端真正添加到主屏幕，建议先部署到 GitHub Pages、Vercel 或 Netlify 这类 HTTPS 静态站点后再测试。部署后用手机浏览器打开 HTTPS 地址：

- Android Chrome：打开页面后，在浏览器菜单中选择“安装应用”或“添加到主屏幕”。
- iPhone Safari：打开页面后，点击分享按钮，然后选择“添加到主屏幕”。

如果需要在同一 Wi-Fi 下临时测试页面布局，可以运行：

```bash
npm run dev -- --host 0.0.0.0
```

然后在手机浏览器访问电脑的局域网 IP 和端口。但请注意，非 HTTPS 的局域网地址通常不能完整触发 PWA 安装能力；正式 PWA 安装测试仍建议使用 HTTPS 部署地址。
