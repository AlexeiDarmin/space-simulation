import { IState } from "src/App";
import { createPlanet, createStar } from 'src/helpers/entities';
import { FPS } from 'src/constants';
import { brighten } from 'src/helpers/drawing';
import { IPlanet, ISystem, IGalaxy } from 'src/models';

export const startGameLoop = (
  canvas: any,
  getState: () => IState,
  system: ISystem
) => {
  return setInterval(drawSystem(canvas, getState, system, 1), 1000 / FPS)
}

export const startGameLoop2 = (
  canvas: any,
  getState: () => IState,
  galaxy: IGalaxy
) => {
  return setInterval(runGame2(canvas, getState, galaxy), 1000 / FPS)
}

export function initializeSystem(getState: () => IState): ISystem {
  const planets = new Map()
  const { canvasSize: { width, height } } = getState()

  const centralStar = createSystemStar(width, height)

  for (let i = 0; i < 5; ++i) {
    const planet = createPlanet(centralStar, width, height)
    planets.set(planet.id, planet)
  }
  planets.set(centralStar.id, centralStar)
  // parentId = parentPlanet.id

  return {
    centralStar,
    planets
  }
}

export function createSystemStar(width: number, height: number) {
  const parentPlanet = createPlanet(null, width, height)
  parentPlanet.size = Math.floor((Math.random() * 10) + 5)
  parentPlanet.position = {
    x: (width / 2 - parentPlanet.size / 2),
    y: (height / 2 - parentPlanet.size / 2)
  }

  parentPlanet.color = '#ff995b'

  return parentPlanet
}

export function initializeStars(getState: () => IState) {
  const stars = new Map()
  const { canvasSize: { width, height } } = getState()
  for (let i = 0; i < 200; ++i) {
    const star = createStar(width, height)
    stars.set(star.id, star)
  }

  return stars
}

let elapsedTime = 0
let sunlight = 0
export const drawSystem = (
  canvas: any,
  getState: () => IState,
  system: ISystem,
  level: number
) => {
  debugger

  const ctx = canvas.getContext("2d")

  elapsedTime = elapsedTime + 1
  const { planets } = system
  const { canvasSize: { width, height } } = getState()

  if (elapsedTime === 1 || elapsedTime % 4 === 0) {
    sunlight = 50 + Math.floor((Math.random() * 20) + 15)
  }

  const theta = (new Date().getTime() / 1000) / 2

  // update system star position first
  const planet = system.centralStar
  const galaxyCenter = {
    x: width / 2,
    y: height / 2
  }

  const thetaStar = theta / (1 / level) / 10
  const xr = galaxyCenter.x / level
  const yr = galaxyCenter.y / level

  const x = galaxyCenter.x + xr * Math.cos(thetaStar)
  const y = galaxyCenter.y + xr * Math.sin(thetaStar)
  planet.position = {
    x,
    y
  }
  ctx.beginPath()
  ctx.arc(x, y, planet.size, 0, 2 * Math.PI)
  ctx.fillStyle = planet.color
  ctx.fill()
  ctx.stroke()

  planets.forEach(planet => {
    const planetTheta = theta / (1 / planet.size) / 5
    const parentSize = planet.parentPlanet ? planet.parentPlanet.size : 0
    const numerator = parentSize - planet.size
    const denomerator = parentSize
    const r = parentSize * (parentSize / 2) * ((numerator / denomerator))
    // const theta = elapsedTime % (3600) / (numerator * 100 / denomerator)

    let x
    let y
    if (planet.parentPlanet) {
      x = r * Math.cos(planetTheta) + planet.parentPlanet.position.x
      y = r * Math.sin(planetTheta) + planet.parentPlanet.position.y
    } else {
      x = planet.position.x
      y = planet.position.y
    }

    // drawing
    ctx.beginPath()

    ctx.arc(x, y, planet.size, 0, 2 * Math.PI)

    let gradient
    if (planet.parentPlanet) {
      gradient = ctx.createLinearGradient(
        (x + Math.cos(theta) * planet.size).toFixed(2),
        (y + Math.sin(theta) * planet.size).toFixed(2),
        (x - Math.cos(theta) * planet.size).toFixed(2),
        (y - Math.sin(theta) * planet.size).toFixed(2)
      )

      // Add three color stops
      gradient.addColorStop(0, 'black')
      gradient.addColorStop(0.5, planet.color)
      gradient.addColorStop(1, brighten(planet.color))
    }

    if (!planet.parentPlanet || planet.parentPlanet.id.length === 0) {
      ctx.shadowBlur = sunlight
      ctx.shadowColor = planet.color
      ctx.strokeStyle = planet.color

      gradient = ctx.createRadialGradient(
        planet.position.x,
        planet.position.y,
        planet.size / 2 * (sunlight / 70),
        planet.position.x,
        planet.position.y,
        planet.size)

      gradient.addColorStop(0, '#ff5e5e')
      gradient.addColorStop(1, planet.color)

    } else {
      ctx.shadowBlur = null
      ctx.shadowColor = null
      ctx.strokeStyle = 'rgba(0,0,0,0)'
    }
    ctx.fillStyle = gradient ? gradient : planet.color
    ctx.fill()
    ctx.stroke()
  });

  return null
}




function getCenterOfGalaxy(width, height) {

}


const Levels = {
  'one': 1.5,
  'two': 2,
  'three': 3.1,
  'four': 5
}

export const runGame2 = (
  canvas: any,
  getState: () => IState,
  galaxy: IGalaxy
) => () => {
  elapsedTime = elapsedTime + 1
  const { canvasSize: { width, height } } = getState()
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, width, height);

  const galaxyCenter = {
    width: width / 2,
    height: height / 2
  }
  drawSystem(canvas, getState, galaxy.systems[0], Levels.one)
  drawSystem(canvas, getState, galaxy.systems[1], Levels.two)
  drawSystem(canvas, getState, galaxy.systems[2], Levels.three)
  drawSystem(canvas, getState, galaxy.systems[3], Levels.four)


  // drawing
  ctx.beginPath()

  ctx.arc(galaxyCenter.width, galaxyCenter.height, galaxyCenter.width / Levels.one, 0, 2 * Math.PI)
  ctx.arc(galaxyCenter.width, galaxyCenter.height, galaxyCenter.width / Levels.two, 0, 2 * Math.PI)
  ctx.arc(galaxyCenter.width, galaxyCenter.height, galaxyCenter.width / Levels.three, 0, 2 * Math.PI)
  ctx.arc(galaxyCenter.width, galaxyCenter.height, galaxyCenter.width / Levels.four, 0, 2 * Math.PI)


  // render central star here

  // render each individual system here

  ctx.strokeStyle = '#2386aca6'
  ctx.stroke()

}
