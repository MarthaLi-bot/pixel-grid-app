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
