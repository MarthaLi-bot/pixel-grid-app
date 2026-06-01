function ImageUploader({ onImageSelect, fileName }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <section className="panel upload-panel" aria-labelledby="upload-title">
      <div>
        <p className="eyebrow">第一步</p>
        <h2 id="upload-title">上传本地图片</h2>
        <p className="muted">图片只会在你的浏览器中处理，不会上传到服务器。</p>
      </div>
      <label className="upload-box">
        <input type="file" accept="image/*" onChange={handleChange} />
        <span className="upload-icon" aria-hidden="true">＋</span>
        <strong>{fileName || '选择一张图片'}</strong>
        <small>支持常见 JPG、PNG、WebP 等图片格式</small>
      </label>
    </section>
  );
}

export default ImageUploader;
