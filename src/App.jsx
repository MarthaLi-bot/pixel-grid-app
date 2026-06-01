import { useEffect, useRef, useState } from 'react';
import ImageUploader from './components/ImageUploader.jsx';
import PixelControls from './components/PixelControls.jsx';
import PreviewGrid from './components/PreviewGrid.jsx';
import { pixelateImageToCanvas } from './utils/pixelateImage.js';

const DEFAULT_SETTINGS = {
  blockSize: 12,
  showGrid: true,
  gridColor: '#ffffff',
  gridLineWidth: 1,
};

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const canvasRef = useRef(null);
  const renderRequestRef = useRef(0);

  useEffect(() => {
    const renderRequestId = renderRequestRef.current + 1;
    renderRequestRef.current = renderRequestId;
    setIsCanvasReady(false);

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);

    if (!imageUrl) {
      return undefined;
    }

    const image = new Image();
    image.onload = () => {
      if (renderRequestRef.current !== renderRequestId || !canvasRef.current) {
        return;
      }

      pixelateImageToCanvas(image, canvasRef.current, settings);
      setIsCanvasReady(true);
    };
    image.onerror = () => {
      if (renderRequestRef.current === renderRequestId) {
        setIsCanvasReady(false);
      }
    };
    image.src = imageUrl;

    return () => {
      if (renderRequestRef.current === renderRequestId) {
        setIsCanvasReady(false);
      }
    };
  }, [imageUrl, settings]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleImageSelect = (file) => {
    setIsCanvasReady(false);
    setImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  };

  const handleSettingsChange = (nextSettings) => {
    setIsCanvasReady(false);
    setSettings(nextSettings);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;

    if (!canvas || !isCanvasReady) {
      return;
    }

    const link = document.createElement('a');
    link.download = 'pixel-grid-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const hasImage = Boolean(imageUrl);
  const canExport = hasImage && isCanvasReady;

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">本地 Canvas 图片工具</p>
        <h1>图片像素格转换器</h1>
        <p>
          上传图片后，选择像素块大小、网格线颜色和粗细，即可在浏览器中生成并导出像素格 PNG。
        </p>
      </header>

      <div className="workspace">
        <div className="sidebar">
          <ImageUploader onImageSelect={handleImageSelect} fileName={fileName} />
          <PixelControls
            settings={settings}
            onSettingsChange={handleSettingsChange}
            disabled={!hasImage}
            exportDisabled={!canExport}
            onExport={handleExport}
          />
        </div>
        <PreviewGrid imageUrl={imageUrl} canvasRef={canvasRef} />
      </div>
    </main>
  );
}

export default App;
