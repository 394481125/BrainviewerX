export function normalizeMinMax(img: Float32Array | Int16Array | Uint8Array | Uint16Array) {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < img.length; i++) {
    if (img[i] < min) min = img[i];
    if (img[i] > max) max = img[i];
  }
  const range = max - min;
  if (range === 0) return new Float32Array(img);
  
  const out = new Float32Array(img.length);
  for (let i = 0; i < img.length; i++) {
    out[i] = (img[i] - min) / range;
  }
  return out;
}

export function normalizeZScore(img: Float32Array | Int16Array | Uint8Array | Uint16Array) {
  let sum = 0;
  for (let i = 0; i < img.length; i++) sum += img[i];
  const mean = sum / img.length;
  
  let sumSq = 0;
  for (let i = 0; i < img.length; i++) {
    const diff = img[i] - mean;
    sumSq += diff * diff;
  }
  const std = Math.sqrt(sumSq / img.length);
  
  const out = new Float32Array(img.length);
  if (std === 0) return out;
  for (let i = 0; i < img.length; i++) {
    out[i] = (img[i] - mean) / std;
  }
  return out;
}

export function applyThresholdMean(img: Float32Array | Int16Array | Uint8Array | Uint16Array) {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < img.length; i++) {
    if (img[i] > 0) {
      sum += img[i];
      count++;
    }
  }
  const mean = count === 0 ? 0 : sum / count;
  
  const out = new Float32Array(img.length);
  for (let i = 0; i < img.length; i++) {
    out[i] = img[i] >= mean ? 1 : 0;
  }
  return out;
}

export function invertImage(img: Float32Array | Int16Array | Uint8Array | Uint16Array) {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < img.length; i++) {
    if (img[i] < min) min = img[i];
    if (img[i] > max) max = img[i];
  }
  const out = new Float32Array(img.length);
  for (let i = 0; i < img.length; i++) {
    out[i] = max - (img[i] - min);
  }
  return out;
}

export function calculateROIStats(img: Float32Array | Int16Array | Uint8Array | Uint16Array) {
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let nonZeroCount = 0;
  
  for (let i = 0; i < img.length; i++) {
    const val = img[i];
    if (val !== 0) {
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
      nonZeroCount++;
    }
  }
  if (nonZeroCount === 0) return { min: 0, max: 0, mean: 0, std: 0, count: 0 };
  
  const mean = sum / nonZeroCount;
  let sumSq = 0;
  for (let i = 0; i < img.length; i++) {
    const val = img[i];
    if (val !== 0) {
      const diff = val - mean;
      sumSq += diff * diff;
    }
  }
  const std = Math.sqrt(sumSq / nonZeroCount);
  return { min, max, mean, std, count: nonZeroCount };
}

export function boxBlur3D(img: Float32Array | Int16Array | Uint8Array | Uint16Array, dims: number[]) {
  const [nx, ny, nz] = dims;
  const out = new Float32Array(img.length);
  
  for (let z = 1; z < nz - 1; z++) {
    for (let y = 1; y < ny - 1; y++) {
      for (let x = 1; x < nx - 1; x++) {
         let sum = 0;
         for(let dz = -1; dz <= 1; dz++) {
             for(let dy = -1; dy <= 1; dy++) {
                 for(let dx = -1; dx <= 1; dx++) {
                     const idx = (z+dz)*nx*ny + (y+dy)*nx + (x+dx);
                     sum += img[idx];
                 }
             }
         }
         const centerIdx = z*nx*ny + y*nx + x;
         out[centerIdx] = sum / 27.0;
      }
    }
  }
  return out;
}
