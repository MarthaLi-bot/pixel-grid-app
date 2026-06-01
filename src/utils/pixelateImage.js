import { quantizeColors } from './colorQuantization.js';

const LABEL_AREA_HEIGHT = 72;
const LABEL_PADDING = 18;
const MIN_EXPORT_WIDTH = 760;

export function pixelateImageToCanvas(image, canvas, options) {
  const { blockSize, showGrid, gridColor, gridLineWidth, colorCount } = options;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  const columns = Math.ceil(imageWidth / blockSize);
  const rows = Math.ceil(imageHeight / blockSize);
  const stats = {
    imageWidth,
    imageHeight,
    columns,
    rows,
    total: columns * rows,
  };
  const blockColors = quantizeColors(readBlockColors(image, stats, blockSize), colorCount);

  const outputWidth = Math.max(imageWidth, MIN_EXPORT_WIDTH);
  const imageOffsetX = Math.floor((outputWidth - imageWidth) / 2);

  canvas.width = outputWidth;
  canvas.height = imageHeight + LABEL_AREA_HEIGHT;
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLabelArea(context, canvas.width, stats, options);
  drawPixelBlocks(context, stats, blockSize, blockColors, imageOffsetX, LABEL_AREA_HEIGHT);

  if (showGrid && gridLineWidth > 0) {
    drawGrid(
      context,
      imageWidth,
      imageHeight,
      blockSize,
      gridColor,
      gridLineWidth,
      imageOffsetX,
      LABEL_AREA_HEIGHT,
    );
  }

  return stats;
}

function readBlockColors(image, stats, blockSize) {
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = stats.imageWidth;
  sourceCanvas.height = stats.imageHeight;

  const sourceContext = sourceCanvas.getContext('2d');
  sourceContext.drawImage(image, 0, 0);

  return Array.from({ length: stats.rows * stats.columns }, (_, index) => {
    const column = index % stats.columns;
    const row = Math.floor(index / stats.columns);
    const blockWidth = Math.min(blockSize, stats.imageWidth - column * blockSize);
    const blockHeight = Math.min(blockSize, stats.imageHeight - row * blockSize);
    const sampleX = Math.min(column * blockSize + Math.floor(blockWidth / 2), stats.imageWidth - 1);
    const sampleY = Math.min(row * blockSize + Math.floor(blockHeight / 2), stats.imageHeight - 1);
    const [red, green, blue] = sourceContext.getImageData(sampleX, sampleY, 1, 1).data;

    return [red, green, blue];
  });
}

function drawLabelArea(context, width, stats, options) {
  context.save();
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, LABEL_AREA_HEIGHT);
  context.fillStyle = '#172033';
  context.font = '700 18px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  context.textBaseline = 'top';
  context.fillText('像素格统计', LABEL_PADDING, 14);

  context.fillStyle = '#4b5870';
  context.font = '14px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  context.fillText(
    `横向：${stats.columns} 格　纵向：${stats.rows} 格　总格数：${stats.columns} × ${stats.rows}　像素块：${options.blockSize}px　颜色数量：${getColorCountLabel(options.colorCount)}`,
    LABEL_PADDING,
    42,
  );

  context.strokeStyle = '#d9e1ef';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, LABEL_AREA_HEIGHT - 0.5);
  context.lineTo(width, LABEL_AREA_HEIGHT - 0.5);
  context.stroke();
  context.restore();
}

function drawPixelBlocks(context, stats, blockSize, blockColors, offsetX, offsetY) {
  blockColors.forEach(([red, green, blue], index) => {
    const column = index % stats.columns;
    const row = Math.floor(index / stats.columns);
    const x = column * blockSize;
    const y = row * blockSize;
    const blockWidth = Math.min(blockSize, stats.imageWidth - x);
    const blockHeight = Math.min(blockSize, stats.imageHeight - y);

    context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    context.fillRect(offsetX + x, offsetY + y, blockWidth, blockHeight);
  });
}

function drawGrid(context, width, height, blockSize, gridColor, gridLineWidth, offsetX, offsetY) {
  context.save();
  context.strokeStyle = gridColor;
  context.lineWidth = gridLineWidth;

  const verticalLines = createGridLinePositions(width, blockSize);
  const horizontalLines = createGridLinePositions(height, blockSize);

  verticalLines.forEach((x) => {
    const lineX = clampLinePosition(x, width, gridLineWidth);

    context.beginPath();
    context.moveTo(offsetX + lineX, offsetY);
    context.lineTo(offsetX + lineX, offsetY + height);
    context.stroke();
  });

  horizontalLines.forEach((y) => {
    const lineY = offsetY + clampLinePosition(y, height, gridLineWidth);

    context.beginPath();
    context.moveTo(offsetX, lineY);
    context.lineTo(offsetX + width, lineY);
    context.stroke();
  });

  context.restore();
}

function createGridLinePositions(length, blockSize) {
  const positions = [];

  for (let position = 0; position <= length; position += blockSize) {
    positions.push(position);
  }

  if (positions.at(-1) !== length) {
    positions.push(length);
  }

  return positions;
}

function clampLinePosition(position, length, lineWidth) {
  const halfLine = lineWidth / 2;

  if (position <= 0) {
    return halfLine;
  }

  if (position >= length) {
    return length - halfLine;
  }

  return position;
}

function getColorCountLabel(colorCount) {
  if (!colorCount || colorCount === 'original') {
    return '原图颜色';
  }

  return `${colorCount} 色`;
}
