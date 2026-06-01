import { quantizeSampleColors } from './colorQuantization.js';

const ANNOTATION_HEIGHT = 72;
const ANNOTATION_MIN_WIDTH = 360;
const ANNOTATION_PADDING = 18;

export function pixelateImageToCanvas(image, canvas, options) {
  const {
    blockSize,
    showGrid,
    gridColor,
    gridLineWidth,
    colorCount = 'original',
  } = options;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  const stats = calculatePixelGridStats(imageWidth, imageHeight, blockSize);
  const canvasWidth = Math.max(imageWidth, ANNOTATION_MIN_WIDTH);
  const imageOffsetX = Math.floor((canvasWidth - imageWidth) / 2);
  const imageOffsetY = ANNOTATION_HEIGHT;

  canvas.width = canvasWidth;
  canvas.height = imageHeight + ANNOTATION_HEIGHT;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawAnnotation(context, canvas.width, stats);

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = imageWidth;
  sourceCanvas.height = imageHeight;
  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });

  if (!sourceContext) {
    return stats;
  }

  sourceContext.drawImage(image, 0, 0, imageWidth, imageHeight);
  const blocks = collectPixelBlocks(sourceContext, imageWidth, imageHeight, blockSize);
  const colors = quantizeSampleColors(
    blocks.map((block) => block.color),
    colorCount,
  );

  blocks.forEach((block, index) => {
    const [red, green, blue, alpha] = colors[index];

    context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
    context.fillRect(
      imageOffsetX + block.x,
      imageOffsetY + block.y,
      block.width,
      block.height,
    );
  });

  if (showGrid && gridLineWidth > 0) {
    drawGrid(
      context,
      imageWidth,
      imageHeight,
      blockSize,
      gridColor,
      gridLineWidth,
      imageOffsetX,
      imageOffsetY,
    );
  }

  return stats;
}

export function calculatePixelGridStats(width, height, blockSize) {
  const columns = Math.ceil(width / blockSize);
  const rows = Math.ceil(height / blockSize);

  return {
    columns,
    rows,
    total: columns * rows,
  };
}

function collectPixelBlocks(sourceContext, width, height, blockSize) {
  const blocks = [];

  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const blockWidth = Math.min(blockSize, width - x);
      const blockHeight = Math.min(blockSize, height - y);
      const sampleX = Math.min(x + Math.floor(blockWidth / 2), width - 1);
      const sampleY = Math.min(y + Math.floor(blockHeight / 2), height - 1);
      const color = Array.from(sourceContext.getImageData(sampleX, sampleY, 1, 1).data);

      blocks.push({ x, y, width: blockWidth, height: blockHeight, color });
    }
  }

  return blocks;
}

function drawAnnotation(context, width, stats) {
  context.save();
  context.fillStyle = '#f8fbff';
  context.fillRect(0, 0, width, ANNOTATION_HEIGHT);
  context.strokeStyle = '#d8e2f3';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, ANNOTATION_HEIGHT - 0.5);
  context.lineTo(width, ANNOTATION_HEIGHT - 0.5);
  context.stroke();

  context.fillStyle = '#172033';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '700 18px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  context.fillText('像素格数量', width / 2, 24);

  context.fillStyle = '#303c54';
  context.font = '600 14px "Noto Sans SC", "Microsoft YaHei", sans-serif';
  context.fillText(
    `横向：${stats.columns} 格   纵向：${stats.rows} 格   总格数：${stats.columns} × ${stats.rows} = ${stats.total}`,
    width / 2,
    ANNOTATION_HEIGHT - ANNOTATION_PADDING,
  );
  context.restore();
}

function drawGrid(
  context,
  width,
  height,
  blockSize,
  gridColor,
  gridLineWidth,
  offsetX = 0,
  offsetY = 0,
) {
  context.save();
  context.strokeStyle = gridColor;
  context.lineWidth = gridLineWidth;

  const verticalLines = createGridLinePositions(width, blockSize);
  const horizontalLines = createGridLinePositions(height, blockSize);

  verticalLines.forEach((x) => {
    const lineX = offsetX + clampLinePosition(x, width, gridLineWidth);

    context.beginPath();
    context.moveTo(lineX, offsetY);
    context.lineTo(lineX, offsetY + height);
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
