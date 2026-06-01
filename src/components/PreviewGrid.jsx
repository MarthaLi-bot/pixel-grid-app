import ImagePreview from './ImagePreview.jsx';

function PreviewGrid({ imageUrl, canvasRef, settings, gridStats, isRendering }) {
  return (
    <div className="preview-area">
      <PreviewSummary settings={settings} gridStats={gridStats} isRendering={isRendering} />
      <div className="preview-grid">
        <ImagePreview
          type="original"
          title="原图预览"
          helperText="左侧显示你上传的原始图片。"
          imageUrl={imageUrl}
          alt="上传的原图预览"
        />
        <ImagePreview
          type="pixelated"
          title="像素格图片"
          helperText="右侧显示浏览器本地生成的像素化结果，导出 PNG 会包含上方统计标注。"
          imageUrl={imageUrl}
          canvasRef={canvasRef}
          alt="处理后的像素格图片"
          isRendering={isRendering}
        />
      </div>
    </div>
  );
}

function PreviewSummary({ settings, gridStats, isRendering }) {
  const colorLabel = settings.colorCount === 'original' ? '原图颜色' : `${settings.colorCount} 色`;

  return (
    <section className="summary-panel" aria-label="当前预览设置">
      <SummaryItem label="像素块大小" value={`${settings.blockSize}px`} />
      <SummaryItem label="颜色数量" value={colorLabel} />
      <SummaryItem label="横向格数" value={gridStats ? `${gridStats.columns} 格` : '待生成'} />
      <SummaryItem label="纵向格数" value={gridStats ? `${gridStats.rows} 格` : '待生成'} />
      <SummaryItem label="总格数" value={gridStats ? `${gridStats.columns} × ${gridStats.rows}` : '待生成'} />
      <SummaryItem label="状态" value={isRendering ? '正在生成' : '已同步'} />
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default PreviewGrid;
