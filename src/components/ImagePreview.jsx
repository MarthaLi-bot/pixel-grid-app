function ImagePreview({ title, helperText, imageUrl, canvasRef, alt, type, isRendering = false }) {
  return (
    <section className="preview-card" aria-labelledby={`${type}-title`}>
      <div className="preview-heading">
        <h2 id={`${type}-title`}>{title}</h2>
        <p>{helperText}</p>
      </div>
      <div className="preview-frame">
        {imageUrl ? (
          type === 'original' ? (
            <img src={imageUrl} alt={alt} />
          ) : (
            <div className="canvas-wrap">
              {isRendering && <span className="render-badge">正在更新预览…</span>}
              <canvas ref={canvasRef} aria-label={alt} />
            </div>
          )
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">🖼️</span>
            <p>上传图片后在这里预览</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ImagePreview;
