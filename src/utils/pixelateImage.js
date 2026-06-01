export function pixelateImageToCanvas(image, canvas, options) {
  const { blockSize, showGrid, gridColor, gridLineWidth } = options;
  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      const blockWidth = Math.min(blockSize, canvas.width - x);
      const blockHeight = Math.min(blockSize, canvas.height - y);
      const sampleX = Math.min(x + Math.floor(blockWidth / 2), canvas.width - 1);
      const sampleY = Math.min(y + Math.floor(blockHeight / 2), canvas.height - 1);

      context.drawImage(
        image,
        sampleX,
        sampleY,
        1,
        1,
        x,
        y,
        blockWidth,
        blockHeight,
      );
    }
  }

  if (showGrid && gridLineWidth > 0) {
    drawGrid(context, canvas.width, canvas.height, blockSize, gridColor, gridLineWidth);
  }
}

function drawGrid(context, width, height, blockSize, gridColor, gridLineWidth) {
  context.save();
  context.strokeStyle = gridColor;
  context.lineWidth = gridLineWidth;

  const verticalLines = createGridLinePositions(width, blockSize);
  const horizontalLines = createGridLinePositions(height, blockSize);

  verticalLines.forEach((x) => {
    const lineX = clampLinePosition(x, width, gridLineWidth);

    context.beginPath();
    context.moveTo(lineX, 0);
    context.lineTo(lineX, height);
    context.stroke();
  });

  horizontalLines.forEach((y) => {
    const lineY = clampLinePosition(y, height, gridLineWidth);

    context.beginPath();
    context.moveTo(0, lineY);
    context.lineTo(width, lineY);
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
