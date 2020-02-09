/// <reference path="../types/types.d.ts" /> #

import fText from './shaders/fragmentShader.frag'
import vText from './shaders/vertexShader.vert'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
canvas.width = WIDTH
canvas.height = HEIGHT

const gl = canvas.getContext('webgl')

gl.clearColor(0.75, 0.85, 0.8, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

const vShader = gl.createShader(gl.VERTEX_SHADER)
const fShader = gl.createShader(gl.FRAGMENT_SHADER)

gl.shaderSource(vShader, vText)
gl.shaderSource(fShader, fText)

gl.compileShader(vShader)
if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS))
  console.error(`ERROR compiling vShader`, gl.getShaderInfoLog(vShader))

gl.compileShader(fShader)
if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS))
  console.error(`ERROR compiling fShader`, gl.getShaderInfoLog(fShader))

const prog = gl.createProgram()
gl.attachShader(prog, vShader)
gl.attachShader(prog, fShader)
gl.linkProgram(prog)
if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
  console.error(`ERROR linking program`, gl.getProgramInfoLog(prog))

gl.validateProgram(prog)
if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS))
  console.error(`ERROR validate program`, gl.getProgramInfoLog(prog))

//
// Create Buffer
//

const triangleVerticies = [
  0.0,
  0.5,
  1.0,
  1.0,
  0.0,
  /**/ -0.5,
  -0.5,
  0.7,
  0.0,
  1.0,
  /**/ 0.5,
  -0.5,
  0.1,
  1.0,
  0.6,
]

const triangleVertexBufferObject = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(triangleVerticies),
  gl.STATIC_DRAW,
)

const positionAttribLocation = gl.getAttribLocation(prog, 'vertPosition')
const colorAttribLocation = gl.getAttribLocation(prog, 'vertColor')
gl.vertexAttribPointer(
  positionAttribLocation, // Attrib location
  2, // Number of elements per attribute
  gl.FLOAT, // Type of elements
  false,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  0, // Offset from the beginning of a single vertex to this attribute
)
gl.vertexAttribPointer(
  colorAttribLocation, // Attrib location
  3, // Number of elements per attribute
  gl.FLOAT, // Type of elements
  false,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  2 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beginning of a single vertex to this attribute
)

gl.enableVertexAttribArray(positionAttribLocation)
gl.enableVertexAttribArray(colorAttribLocation)

gl.useProgram(prog)
gl.drawArrays(gl.TRIANGLES, 0, 3)
