import ImagePreview from './ImagePreview.jsx';

function PreviewGrid({ imageUrl, canvasRef, pixelGridStats }) {
  return (
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
        helperText="右侧显示浏览器本地生成的像素化结果。"
        imageUrl={imageUrl}
        canvasRef={canvasRef}
        alt="处理后的像素格图片"
        pixelGridStats={pixelGridStats}
      />
    </div>
  );
}

export default PreviewGrid;
