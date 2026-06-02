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

## Windows 桌面版

本项目新增 Electron 桌面壳，用于把现有 React + Vite 图片像素格转换器打包成 Windows 电脑可双击运行的桌面软件。桌面版不会重写或替换现有网页端逻辑，图片像素化、颜色数量、网格线、横向/纵向格数和导出 PNG 等核心功能仍由本机 Canvas 完成。

### 安装依赖

```bash
npm install
```

### 运行桌面开发版

```bash
npm run desktop:dev
```

该命令会启动本机 Vite dev server，并让 Electron 只加载本机地址 `http://127.0.0.1:5173`。开发模式仅用于本机调试，不依赖公网服务。

### 构建 Windows 桌面软件

```bash
npm run desktop:build
```

该命令会先用桌面模式构建本地 `dist/index.html` 和静态资源，再通过 electron-builder 生成 Windows 程序。桌面生产版会从本地 `dist/index.html` 加载应用，不会加载 Vercel、GitHub Pages、`github.io`、`vercel.app` 或任何公网 URL。

构建完成后，请到 `release/` 目录查找 Windows 输出文件，通常包括：

- 免安装版 portable `.exe`
- 安装版 `.exe`

本项目生成的是未签名 Windows exe，不配置也不需要代码签名证书；桌面打包配置会跳过 Windows 代码签名相关步骤，并且构建脚本会关闭证书自动发现，避免调用 Windows 签名辅助工具。如果 Windows SmartScreen 显示“未知发布者”，这是因为生成的 exe 没有代码签名证书，不代表程序会联网，也不代表程序会上传图片。

如果你之前构建时卡在 `winCodeSign` 下载或解压（例如提示 `Cannot create symbolic link`），请更新到当前代码后重新运行：

```powershell
npm.cmd run desktop:build
```

如本机保留了上一次失败的 electron-builder 缓存，可先删除 `%LOCALAPPDATA%\electron-builder\Cache\winCodeSign` 后再重试。

如果 `desktop:build` 仍因 `winCodeSign` 下载或解压失败，也可以改用不生成安装器、不生成 portable、不做代码签名的 unpacked 构建：

```powershell
npm.cmd run desktop:build:unpacked
```

该命令只生成 `release/win-unpacked/` 目录。构建完成后，进入该目录并双击其中的 `图片像素格转换器.exe` 即可运行桌面版。

### 断网验收步骤

1. 关闭 Wi-Fi，或断开有线网络。
2. 双击 `release/` 目录中的 Windows exe。
3. 上传一张本地图片。
4. 生成像素格效果。
5. 切换颜色数量、显示或隐藏网格线，并确认横向/纵向格数正常显示。
6. 导出 PNG。

桌面版所有图片处理都在用户电脑本机完成，不上传用户图片；生产模式不依赖 Vercel、GitHub Pages、VPN、CDN、在线字体、在线图标、远程脚本、远程 CSS 或任何公网服务。为避免 PWA 缓存影响 Electron 本地文件加载，应用在 Electron 环境中会跳过 service worker 注册。
