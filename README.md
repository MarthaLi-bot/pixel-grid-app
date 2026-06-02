# 图片像素格转换器

一个使用 React + Vite + JavaScript 开发的纯前端图片像素格转换器。用户可以上传本地图片，在浏览器内通过 HTML Canvas 生成像素格效果，并导出 PNG 图片。

## 安全说明

所有图片处理都在浏览器本地完成，不会上传用户图片。本项目不包含后端、数据库、登录系统、云存储或支付功能，不读取用户隐私数据。

## 功能

- 上传一张本地图片并预览原图。
- 实时查看像素格处理结果。
- 调整像素块大小：4、8、12、16、24、32。
- 选择颜色数量：原图颜色、8 色、4 色、2 色。
- 显示或隐藏网格线。
- 调整网格线颜色和粗细。
- 显示横向格数、纵向格数和总格数。
- 将处理后的图片导出为 PNG。
- 手机端单列布局，适合手机浏览器使用。
- 支持基础 PWA，可部署后添加到手机主屏幕。

## 技术栈

- React
- Vite
- JavaScript
- HTML Canvas
- Web App Manifest
- Service Worker

## 本地安装

请先确认本机已安装 Node.js 和 npm。

```bash
npm install
```

## 本地开发与构建

```bash
npm run dev
npm run build
npm run preview
```

默认构建会使用根路径 `/`，适合 Vercel 等部署到站点根目录的平台。

## GitHub Pages 构建

如果需要继续部署到 GitHub Pages 的 `/pixel-grid-app/` 子路径，请在构建时设置环境变量：

```bash
DEPLOY_TARGET=github-pages npm run build
```

## Vercel 部署

本项目是纯前端 React + Vite 单页应用，部署到 Vercel 时不需要后端、数据库、登录系统、云存储、支付功能或 `.env` 文件。

1. 登录 Vercel。
2. 选择 **Import Git Repository**。
3. 选择仓库 **MarthaLi-bot / pixel-grid-app**。
4. **Framework Preset** 选择 **Vite**。
5. **Build Command** 填写 `npm run build`。
6. **Output Directory** 填写 `dist`。
7. 点击 **Deploy**。
8. 部署成功后，使用 Vercel 提供的 HTTPS 地址打开应用，例如 `https://项目名.vercel.app/`。
9. 在 iPhone Safari 中打开该 HTTPS 地址，点击分享按钮，选择“添加到主屏幕”，确认应用图标和名称可正常显示，并从主屏幕启动应用进行上传、像素化和导出测试。

Vercel 会使用根路径 `/` 加载静态资源、`manifest.webmanifest` 和 `sw.js`。项目中的 `vercel.json` 已将所有前端路由重写到 `/index.html`，便于单页应用刷新或直接访问子路径。
