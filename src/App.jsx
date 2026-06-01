import { useEffect, useRef, useState } from 'react';
import ImageUploader from './components/ImageUploader.jsx';
import PixelControls from './components/PixelControls.jsx';
import PreviewGrid from './components/PreviewGrid.jsx';
import { pixelateImageToCanvas } from './utils/pixelateImage.js';

const DEFAULT_SETTINGS = {
  blockSize: 12,
  colorCount: 'original',
  showGrid: true,
  gridColor: '#ffffff',
  gridLineWidth: 1,
};

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [gridStats, setGridStats] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) {
      setGridStats(null);
      setIsRendering(false);
      return undefined;
    }

    let isCanceled = false;
    setIsRendering(true);

    const image = new Image();
    image.onload = () => {
      window.requestAnimationFrame(() => {
        if (isCanceled || !canvasRef.current) {
          return;
        }

        const nextStats = pixelateImageToCanvas(image, canvasRef.current, settings);
        setGridStats(nextStats);
        setIsRendering(false);
      });
    };
    image.onerror = () => {
      if (!isCanceled) {
        setGridStats(null);
        setIsRendering(false);
      }
    };
    image.src = imageUrl;

    return () => {
      isCanceled = true;
    };
  }, [imageUrl, settings]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleSettingsChange = (nextSettings) => {
    if (hasImage) {
      setIsRendering(true);
    }

    setSettings(nextSettings);
  };

  const handleImageSelect = (file) => {
    setIsRendering(true);
    setGridStats(null);
    setImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;

    if (!canvas || isRendering) {
      return;
    }

    const link = document.createElement('a');
    link.download = 'pixel-grid-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const hasImage = Boolean(imageUrl);
  const disableExport = !hasImage || isRendering || !gridStats;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">本地 Canvas 图片工具</p>
        <h1>图片像素格转换器</h1>
        <p>
          上传图片后，选择像素块大小、网格线、颜色数量和粗细，即可在浏览器中生成并导出像素格 PNG。
        </p>
      </header>

      <div className="workspace">
        <div className="sidebar">
          <ImageUploader onImageSelect={handleImageSelect} fileName={fileName} />
          <PixelControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
            disabled={!hasImage}
            exportDisabled={disableExport}
            isRendering={isRendering}
            onExport={handleExport}
          />
        </div>
        <PreviewGrid
          imageUrl={imageUrl}
          canvasRef={canvasRef}
          settings={settings}
          gridStats={gridStats}
          isRendering={isRendering}
        />
      </div>
    </main>
  );
}

export default App;
