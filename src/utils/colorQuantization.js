const K_MEANS_ITERATIONS = 8;

export function quantizeColors(colors, colorCount) {
  if (!colorCount || colorCount === 'original' || colors.length === 0) {
    return colors;
  }

  const paletteSize = Number(colorCount);
  const palette = createPalette(colors, paletteSize);

  return colors.map((color) => findNearestColor(color, palette));
}

function createPalette(colors, paletteSize) {
  const uniqueColors = getUniqueColors(colors);

  if (uniqueColors.length <= paletteSize) {
    return uniqueColors;
  }

  let centroids = pickInitialCentroids(uniqueColors, paletteSize);

  for (let iteration = 0; iteration < K_MEANS_ITERATIONS; iteration += 1) {
    const buckets = Array.from({ length: paletteSize }, () => []);

    uniqueColors.forEach((color) => {
      const nearestIndex = findNearestColorIndex(color, centroids);
      buckets[nearestIndex].push(color);
    });

    centroids = centroids.map((centroid, index) => {
      if (buckets[index].length === 0) {
        return centroid;
      }

      return averageColor(buckets[index]);
    });
  }

  return centroids.map((color) => color.map((channel) => Math.round(channel)));
}

function getUniqueColors(colors) {
  const colorMap = new Map();

  colors.forEach((color) => {
    colorMap.set(color.join(','), color);
  });

  return [...colorMap.values()];
}

function pickInitialCentroids(colors, paletteSize) {
  const sortedColors = [...colors].sort((a, b) => getLuminance(a) - getLuminance(b));

  return Array.from({ length: paletteSize }, (_, index) => {
    const colorIndex = Math.round((index * (sortedColors.length - 1)) / (paletteSize - 1));
    return [...sortedColors[colorIndex]];
  });
}

function getLuminance([red, green, blue]) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function averageColor(colors) {
  const totals = colors.reduce(
    (sum, color) => [sum[0] + color[0], sum[1] + color[1], sum[2] + color[2]],
    [0, 0, 0],
  );

  return totals.map((channel) => channel / colors.length);
}

function findNearestColor(color, palette) {
  return palette[findNearestColorIndex(color, palette)];
}

function findNearestColorIndex(color, palette) {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  palette.forEach((paletteColor, index) => {
    const distance = getColorDistance(color, paletteColor);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function getColorDistance([redA, greenA, blueA], [redB, greenB, blueB]) {
  return (redA - redB) ** 2 + (greenA - greenB) ** 2 + (blueA - blueB) ** 2;
}
