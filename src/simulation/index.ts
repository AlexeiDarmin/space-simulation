import { IState } from "src/App";
import { createPlanet, createStar } from 'src/helpers/entities';
import { FPS } from 'src/constants';
import { brighten } from 'src/helpers/drawing';
import { IPlanet } from 'src/models';

export const startGameLoop = (canvas: any, getState: () => IState, planets: Map<string, IPlanet>) => {
  return setInterval(runGame(canvas, getState, planets), 1000 / FPS)
}

export function initializePlanets(getState: () => IState) {
  const planets = new Map()

  const { canvasSize: { width, height }} = getState()
  const parentPlanet = createPlanet(null,  width, height)
  parentPlanet.size = 25
  parentPlanet.position = {
    x: 475,
    y: 475
  }
  parentPlanet.color = '#ff995b'
  for (let i = 0; i < 25; ++i) {
    const planet = createPlanet(parentPlanet, width, height)
    planets.set(planet.id, planet)
  }
  planets.set(parentPlanet.id, parentPlanet)
  // parentId = parentPlanet.id

  return planets
}

export function initializeStars(getState: () => IState) {
  const stars = new Map()
  const { canvasSize: { width, height } } = getState()
  for (let i = 0; i < 200; ++i) {
    const star = createStar(width, height)
    stars.set(star.id, star)
  }
  debugger

  return stars
}

let elapsedTime = 0
let sunlight = 0
export const runGame = (
  canvas: any, 
  getState: () => IState,
  planets: Map<string, IPlanet>
  ) => () => {
  elapsedTime = elapsedTime + 1

  const { canvasSize: { width, height } } = getState()
  const ogctx = canvas.getContext("2d")

  ogctx.clearRect(0, 0, width, height);

  if (elapsedTime === 1 || elapsedTime % 4 === 0) {
    sunlight = 50 + Math.floor((Math.random() * 20) + 15)
  }

  planets.forEach(planet => {
    const ctx = canvas.getContext("2d")

    const parentSize = planet.parentPlanet ? planet.parentPlanet.size : 0
    const numerator = parentSize - planet.size
    const denomerator = parentSize
    const r = parentSize * (parentSize / 2) * ((numerator / denomerator))
    const theta = elapsedTime % (3600) / (numerator * 100 / denomerator)

    let x
    let y
    if (planet.parentPlanet) {
      x = r * Math.cos(theta) + planet.parentPlanet.position.x
      y = r * Math.sin(theta) + planet.parentPlanet.position.y
    } else {
      x = planet.position.x
      y = planet.position.y
    }

    ctx.beginPath()

    ctx.arc(x, y, planet.size, 0, 2 * Math.PI)

    let gradient
    if (planet.parentPlanet) {
      gradient = ctx.createLinearGradient(
        x + Math.cos(theta) * planet.size,
        y + Math.sin(theta) * planet.size,
        x - Math.cos(theta) * planet.size,
        y - Math.sin(theta) * planet.size
      )

      // Add three color stops
      gradient.addColorStop(0, 'black')
      // gradient.addColorStop(0.25, darken(planet.color))
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
