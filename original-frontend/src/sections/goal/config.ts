export const GRIDS = {
  0: {
    w: 3,
    h: 4,
    multipliers: [1.45, 2.18, 3.27, 4.91].reverse(),
  },
  1: {
    w: 4,
    h: 7,
    multipliers: [1.29, 1.72, 2.3, 3.3, 4.09, 5.45, 7.27].reverse(),
  },
  2: {
    w: 5,
    h: 10,
    multipliers: [1.21, 1.52, 1.89, 2.37, 2.96, 3.79, 4.64, 5.78, 7.23, 9.03].reverse(),
  },
};

export const hashToColumnPosition = (hash: string, gridWidth: number): number =>
  parseInt(hash.substring(0, 8), 16) % gridWidth;
