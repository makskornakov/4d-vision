import {
  Vector4D,
  multiplyMatrices,
  vectorToMatrix,
  Matrix,
  generateRotationMatrix,
  CameraProjection,
  PerspectiveProjection,
  divideMatrixes,
  Viewport,
} from './projections';

const points = [
  [1, 1, 1, 1],
  [1, -1, 1, 1],
  [-1, -1, 1, 1],
  [-1, 1, 1, 1],
  [1, 1, -1, 1],
  [1, -1, -1, 1],
  [-1, -1, -1, 1],
  [-1, 1, -1, 1],
] as Vector4D[];

// simplest projection matrix from 3d to 2d
// const projectionMatrix = [
//   [1, 0, 0, 0],
//   [0, 1, 0, 0],
// ] as Matrix;

// const scale = 1;
// const scaleMatrix = [
//   [scale, 0, 0, 0],
//   [0, scale, 0, 0],
//   [0, 0, scale, 0],
//   [0, 0, 0, 1],
// ] as Matrix;

const colorArray = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#FFA500',
  '#800080',
  '#00FF00',
  '#008080',
  '#FFC0CB',
  '#FFD700',
];

// an array of edges for almost infinit x,y,z lines
const xyzLines = [
  [
    [-5, 0, 0, 1],
    [5, 0, 0, 1],
  ],
  [
    [0, -5, 0, 1],
    [0, 5, 0, 1],
  ],
  [
    [0, 0, -5, 1],
    [0, 0, 5, 1],
  ],
];

export interface Settings3D {
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    value: number;
  };
}

export function draw3D(ctx: CanvasRenderingContext2D, settings: Settings3D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 8 points for a square 4d vector

  // 8 colors for a square

  const rotationMatrix = generateRotationMatrix(
    settings.rotation.x,
    settings.rotation.y,
    settings.rotation.z,
  );
  const camera = new CameraProjection(4, 2, -4, 20, -45, 0);
  const cameraProjection = camera.generateCameraProjectionMatrix();
  const perspective = new PerspectiveProjection(45, 1, 1, 100);
  const perspectiveProjection = perspective.generatePerspectiveProjectionMatrix();
  const viewport = new Viewport(ctx.canvas.width, ctx.canvas.height);
  const viewportProjection = viewport.generateViewportMatrix();
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  function transformPoint(
    point: Vector4D,
    rotation?: boolean,
    scale?: boolean,
  ): number[] | undefined {
    const matrixPoint = vectorToMatrix(point);
    const scaleMatrix = [
      [settings.scale.value, 0, 0, 0],
      [0, settings.scale.value, 0, 0],
      [0, 0, settings.scale.value, 0],
      [0, 0, 0, 1],
    ] as Matrix;
    const scaledPoint = scale ? multiplyMatrices(scaleMatrix, matrixPoint) : matrixPoint;
    if (!scaledPoint) return;

    const rotatedPoint = rotation ? multiplyMatrices(rotationMatrix, scaledPoint) : scaledPoint;
    if (!rotatedPoint) return;

    if (!cameraProjection) return;
    const cameraPoint = multiplyMatrices(cameraProjection, rotatedPoint);

    if (!cameraPoint) return;
    const perspectivePoint = multiplyMatrices(perspectiveProjection, cameraPoint);

    if (!perspectivePoint) return;

    // now cube_after_PM /= cube_after_PM[3]
    const dividedPoint = divideMatrixes(perspectivePoint, [perspectivePoint[3]]);

    if (!dividedPoint) return;

    const viewPortPoint = multiplyMatrices(viewportProjection, dividedPoint);

    if (!viewPortPoint) return;

    const vectorPoint = [viewPortPoint[0][0], viewPortPoint[1][0]];

    return vectorPoint;
  }

  // indexes of start and end points of each edge
  const cubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],

    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],

    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];

  xyzLines.forEach((line, i) => {
    const start = line[0] as Vector4D;
    const end = line[1] as Vector4D;

    const vectorStart = transformPoint(start);
    const vectorEnd = transformPoint(end);

    if (!vectorStart || !vectorEnd) return;

    ctx.beginPath();
    ctx.strokeStyle = colorArray[i];
    ctx.moveTo(vectorStart[0], vectorStart[1]);
    ctx.lineTo(vectorEnd[0], vectorEnd[1]);
    ctx.stroke();
    ctx.closePath();
  });

  cubeEdges.forEach((edge, i) => {
    const start = points[edge[0]];
    const end = points[edge[1]];

    const vectorStart = transformPoint(start, true, true);
    const vectorEnd = transformPoint(end, true, true);

    if (!vectorStart || !vectorEnd) return;

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(vectorStart[0], vectorStart[1]);
    ctx.lineTo(vectorEnd[0], vectorEnd[1]);
    ctx.stroke();
    ctx.closePath();
  });

  // i and point
  // points.forEach((point, i) => {

  //   const vectorPoint = transformPoint(point);
  //   if (!vectorPoint) return;

  //   ctx.beginPath();
  //   ctx.fillStyle = colorArray[i];
  //   ctx.arc(vectorPoint[0] + width / 2, vectorPoint[1] + height / 2, 5, 0, 2 * Math.PI);
  //   ctx.fill();
  //   ctx.closePath();
  // });
}
