const ORIGINAL_COLOR_VALUE = 'original';
const MAX_KMEANS_ITERATIONS = 10;

export function quantizeSampleColors(colors, colorCount) {
  const paletteSize = Number(colorCount);

  if (colorCount === ORIGINAL_COLOR_VALUE || !Number.isFinite(paletteSize) || paletteSize <= 0) {
    return colors;
  }

  const opaqueColors = colors.filter((color) => color[3] > 0);

  if (opaqueColors.length === 0) {
    return colors;
  }

  const centroids = createInitialCentroids(opaqueColors, paletteSize);

  for (let iteration = 0; iteration < MAX_KMEANS_ITERATIONS; iteration += 1) {
    const groups = Array.from({ length: centroids.length }, () => []);

    opaqueColors.forEach((color) => {
      groups[findClosestCentroidIndex(color, centroids)].push(color);
    });

    let changed = false;

    groups.forEach((group, index) => {
      if (group.length === 0) {
        return;
      }

      const nextCentroid = averageColor(group);

      if (!colorsMatch(centroids[index], nextCentroid)) {
        changed = true;
        centroids[index] = nextCentroid;
      }
    });

    if (!changed) {
      break;
    }
  }

  return colors.map((color) => {
    if (color[3] === 0) {
      return color;
    }

    return centroids[findClosestCentroidIndex(color, centroids)];
  });
}

function createInitialCentroids(colors, paletteSize) {
  const uniqueColors = Array.from(
    new Map(colors.map((color) => [color.slice(0, 4).join(','), color])).values(),
  );
  const sortedColors = uniqueColors.sort((first, second) => getLuminance(first) - getLuminance(second));

  if (sortedColors.length <= paletteSize) {
    return sortedColors.map((color) => [...color]);
  }

  return Array.from({ length: paletteSize }, (_, index) => {
    const colorIndex = Math.round((index * (sortedColors.length - 1)) / Math.max(paletteSize - 1, 1));
    return [...sortedColors[colorIndex]];
  });
}

function findClosestCentroidIndex(color, centroids) {
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  centroids.forEach((centroid, index) => {
    const distance = getColorDistance(color, centroid);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function averageColor(colors) {
  const totals = colors.reduce(
    (sum, color) => [
      sum[0] + color[0],
      sum[1] + color[1],
      sum[2] + color[2],
      sum[3] + color[3],
    ],
    [0, 0, 0, 0],
  );

  return totals.map((total) => Math.round(total / colors.length));
}

function colorsMatch(first, second) {
  return first.every((value, index) => value === second[index]);
}

function getColorDistance(first, second) {
  const red = first[0] - second[0];
  const green = first[1] - second[1];
  const blue = first[2] - second[2];

  return red * red + green * green + blue * blue;
}

function getLuminance(color) {
  return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
}
