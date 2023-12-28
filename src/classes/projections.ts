// Define a Camera class

export type Vector4D = [number, number, number, number];
export type Matrix = number[][];
export function vectorToMatrix(vector: Vector4D): Matrix {
  return [[vector[0]], [vector[1]], [vector[2]], [vector[3]]];
}
export function matrixToVector(matrix: Matrix): Vector4D {
  return [matrix[0][0], matrix[1][0], matrix[2][0], matrix[3][0]];
}

// number from 0 to 360
export function generateRotationMatrix(x: number, y: number, z: number): Matrix {
  // first translate degrees to radians
  const cosX = Math.cos((x * Math.PI) / 180);
  const sinX = Math.sin((x * Math.PI) / 180);
  const cosY = Math.cos((y * Math.PI) / 180);
  const sinY = Math.sin((y * Math.PI) / 180);
  const cosZ = Math.cos((z * Math.PI) / 180);
  const sinZ = Math.sin((z * Math.PI) / 180);

  const rotationMatrix: Matrix = [
    [cosY * cosZ, cosY * sinZ, -sinY, 0],
    [sinX * sinY * cosZ - cosX * sinZ, sinX * sinY * sinZ + cosX * cosZ, sinX * cosY, 0],
    [cosX * sinY * cosZ + sinX * sinZ, cosX * sinY * sinZ - sinX * cosZ, cosX * cosY, 0],
    [0, 0, 0, 1],
  ];

  return rotationMatrix;
}

export function multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix | null {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  // Check if matrices can be multiplied
  if (colsA !== rowsB) {
    console.error(
      'Matrices cannot be multiplied. Number of columns in the first matrix must be equal to the number of rows in the second matrix.',
    );
    return null;
  }

  // Initialize result matrix with zeros
  const result: number[][] = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(colsB).fill(0);
  }

  // Perform matrix multiplication
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }

  return result;
}

export function divideMatrixes(matrixA: Matrix, matrixB: Matrix): Matrix | null {
  const rowsA = matrixA.length;
  const colsA = matrixA[0].length;
  const rowsB = matrixB.length;
  const colsB = matrixB[0].length;

  // Check if matrices can be multiplied
  if (colsA !== rowsB) {
    console.error(
      'Matrices cannot be multiplied. Number of columns in the first matrix must be equal to the number of rows in the second matrix.',
    );
    return null;
  }

  // Initialize result matrix with zeros
  const result: number[][] = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(colsB).fill(0);
  }

  // Perform matrix multiplication
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += matrixA[i][k] / matrixB[k][j];
      }
    }
  }

  return result;
}

// so the above was for the rotation of the object in the 3D space

// now we need to create a camera projection that will somehow differently calculate translation and rotation of the camera

export class CameraProjection {
  // camera position
  x: number;
  y: number;
  z: number;

  // camera rotation
  rx: number;
  ry: number;
  rz: number;

  constructor(x: number, y: number, z: number, rx: number, ry: number, rz: number) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.rx = rx;
    this.ry = ry;
    this.rz = rz;
  }

  // first we need to create a translation matrix
  generateTranslationMatrix(): Matrix {
    const translationMatrix: Matrix = [
      [1, 0, 0, -this.x],
      [0, 1, 0, -this.y],
      [0, 0, 1, -this.z],
      [0, 0, 0, 1],
    ];

    return translationMatrix;
  }

  // then we need to create a rotation matrix not for the object but for the camera
  generateRotationMatrix(): Matrix {
    const cosX = Math.cos((this.rx * Math.PI) / 180);
    const sinX = Math.sin((this.rx * Math.PI) / 180);
    const cosY = Math.cos((this.ry * Math.PI) / 180);
    const sinY = Math.sin((this.ry * Math.PI) / 180);
    const cosZ = Math.cos((this.rz * Math.PI) / 180);
    const sinZ = Math.sin((this.rz * Math.PI) / 180);

    const rotationMatrix: Matrix = [
      [cosY * cosZ, cosY * sinZ, -sinY, 0],
      [sinX * sinY * cosZ - cosX * sinZ, sinX * sinY * sinZ + cosX * cosZ, sinX * cosY, 0],
      [cosX * sinY * cosZ + sinX * sinZ, cosX * sinY * sinZ - sinX * cosZ, cosX * cosY, 0],
      [0, 0, 0, 1],
    ];

    return rotationMatrix;
  }

  // then we need to create a projection matrix
  generateCameraProjectionMatrix(): Matrix | null {
    // multiply the translation matrix by the rotation matrix
    const translationMatrix = this.generateTranslationMatrix();
    const rotationMatrix = this.generateRotationMatrix();
    const cameraProjectionMatrix = multiplyMatrices(rotationMatrix, translationMatrix);
    // if (!cameraProjectionMatrix) return null;
    return cameraProjectionMatrix;
  }
}

// a class for perspective projection

export class PerspectiveProjection {
  // field of view
  fov: number;
  // aspect ratio
  aspect: number;
  // near clipping plane
  near: number;
  // far clipping plane
  far: number;

  constructor(fov: number, aspect: number, near: number, far: number) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  generatePerspectiveProjectionMatrix(): Matrix {
    const ppMatrix: Matrix = [
      // fov is a number from 0 to 180
      // aspect is a number from 0 to 1
      [1 / (this.aspect * Math.tan(this.fov / 2)), 0, 0, 0],
      [0, 1 / Math.tan(this.fov / 2), 0, 0],
      [
        0,
        0,
        -(this.far + this.near) / (this.far - this.near),
        -(2 * this.far * this.near) / (this.far - this.near),
      ],
      [0, 0, -1, 0],
    ];

    return ppMatrix;
  }
}

// a class for our viewport with nx and ny being the number of pixels in the viewport
export class Viewport {
  nx: number;
  ny: number;

  constructor(nx: number, ny: number) {
    this.nx = nx;
    this.ny = ny;
  }

  //   #ViewPort Matrix
  // nx = 600
  // ny = 600
  // viewport_matrix = np.array([
  // [nx / 2, 0, 0, (nx — 1) / 2],
  // [0, ny / 2, 0, (ny — 1) / 2],
  // [0, 0, 0.5, 0.5],
  // ])

  generateViewportMatrix(): Matrix {
    const viewportMatrix: Matrix = [
      [this.nx / 2, 0, 0, (this.nx - 1) / 2],
      [0, this.ny / 2, 0, (this.ny - 1) / 2],
      [0, 0, 0.5, 0.5],
    ];

    return viewportMatrix;
  }
}

// export class OrthographicProjection {
//   left: number;
//   right: number;
//   bottom: number;
//   top: number;
//   near: number;
//   far: number;

//   constructor(left: number, right: number, bottom: number, top: number, near: number, far: number) {
//     this.left = left;
//     this.right = right;
//     this.bottom = bottom;
//     this.top = top;
//     this.near = near;
//     this.far = far;
//   }

//   // Function to generate the projection matrix
//   generateProjectionMatrix(): math.Matrix {
//     const projectionMatrix: math.Matrix = math.matrix([
//       [2 / (this.right - this.left), 0, 0, -(this.right + this.left) / (this.right - this.left)],
//       [0, 2 / (this.top - this.bottom), 0, -(this.top + this.bottom) / (this.top - this.bottom)],
//       [0, 0, -2 / (this.far - this.near), -(this.far + this.near) / (this.far - this.near)],
//       [0, 0, 0, 1],
//     ]);

//     return projectionMatrix;
//   }
// }
