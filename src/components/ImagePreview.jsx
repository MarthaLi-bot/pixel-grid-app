function ImagePreview({ title, helperText, imageUrl, canvasRef, alt, type, pixelGridStats }) {
  return (
    <section className="preview-card" aria-labelledby={`${type}-title`}>
      <div className="preview-heading">
        <h2 id={`${type}-title`}>{title}</h2>
        <p>{helperText}</p>
      </div>
      {type === 'pixelated' && pixelGridStats ? (
        <dl className="grid-stats" aria-label="像素格数量">
          <div>
            <dt>横向</dt>
            <dd>{pixelGridStats.columns} 格</dd>
          </div>
          <div>
            <dt>纵向</dt>
            <dd>{pixelGridStats.rows} 格</dd>
          </div>
          <div>
            <dt>总格数</dt>
            <dd>{pixelGridStats.columns} × {pixelGridStats.rows} = {pixelGridStats.total}</dd>
          </div>
        </dl>
      ) : null}
      <div className="preview-frame">
        {imageUrl ? (
          type === 'original' ? (
            <img src={imageUrl} alt={alt} />
          ) : (
            <canvas ref={canvasRef} aria-label={alt} />
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
