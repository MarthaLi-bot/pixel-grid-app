const BLOCK_SIZE_OPTIONS = [4, 8, 12, 16, 24, 32];
const COLOR_COUNT_OPTIONS = [
  { value: 'original', label: '原图颜色' },
  { value: '8', label: '8 色' },
  { value: '4', label: '4 色' },
  { value: '2', label: '2 色' },
];

function PixelControls({ settings, onSettingsChange, disabled, exportDisabled, onExport }) {
  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <section className="panel controls-panel" aria-labelledby="controls-title">
      <div>
        <p className="eyebrow">第二步</p>
        <h2 id="controls-title">调整像素格</h2>
      </div>

      <fieldset className="control-group">
        <legend>像素效果</legend>
        <label className="field">
          <span>像素块大小</span>
          <select
            value={settings.blockSize}
            onChange={(event) => updateSetting('blockSize', Number(event.target.value))}
            disabled={disabled}
          >
            {BLOCK_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>颜色数量</span>
          <select
            value={settings.colorCount}
            onChange={(event) => updateSetting('colorCount', event.target.value)}
            disabled={disabled}
          >
            {COLOR_COUNT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="control-group">
        <legend>网格线</legend>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={settings.showGrid}
            onChange={(event) => updateSetting('showGrid', event.target.checked)}
            disabled={disabled}
          />
          <span>显示网格线</span>
        </label>

        <div className="inline-fields">
          <label className="field">
            <span>网格线颜色</span>
            <input
              type="color"
              value={settings.gridColor}
              onChange={(event) => updateSetting('gridColor', event.target.value)}
              disabled={disabled || !settings.showGrid}
            />
          </label>

          <label className="field">
            <span>网格线粗细：{settings.gridLineWidth}px</span>
            <input
              type="range"
              min="1"
              max="8"
              value={settings.gridLineWidth}
              onChange={(event) => updateSetting('gridLineWidth', Number(event.target.value))}
              disabled={disabled || !settings.showGrid}
            />
          </label>
        </div>
      </fieldset>

      <div className="export-bar">
        <button className="primary-button" type="button" onClick={onExport} disabled={exportDisabled}>
          导出 PNG 图片
        </button>
      </div>
    </section>
  );
}

export default PixelControls;
