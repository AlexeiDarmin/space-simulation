import * as React from 'react';
import './App.css';

import logo from './logo.svg';


const FPS = 60
let elapsedTime = 0
const width = 1000
const height = 1000


const stars = {}

interface IPosition {
  x: number
  y: number
}

interface IPlanet {
  id: string
  position: IPosition
  parentPlanet?: IPlanet
  size: number
  color: string
}

function shadeRGBColor(color, percent) {
  var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function blendRGBColors(c0, c1, p) {
  var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
}



function getRandColor(){
  const divisionFactor = 1.5
  // Six levels of brightness from 0 to 5, 0 being the darkest
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  var mixedrgb = [rgb[0] / divisionFactor, rgb[1] / divisionFactor, rgb[2] / divisionFactor].map(function(x){ return Math.round(x/2.0)})
  return "rgb(" + mixedrgb.join(",") + ")";
}


function getRandomColor() {
  const color = getRandColor()

  return color
  // var letters = '0123456789ABCDEF';
  // var color = '#';
  // for (var i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  // return blendRGBColors(color, 'rgb(0,0,0)', 90);
}

let planets = {}

const runGame = (canvas: any) => () => {
  elapsedTime = elapsedTime + 1

  const ogctx = canvas.getContext("2d")

  ogctx.clearRect(0, 0, width, height);

  if (elapsedTime === 1 || elapsedTime % 4 === 0) {
    sunlight = 50 + Math.floor((Math.random() * 20) + 15)
  }

  Object.keys(planets).forEach(function (key) {
    const ctx = canvas.getContext("2d")

    const planet: IPlanet = planets[key];

    const parentSize = planet.parentPlanet ? planet.parentPlanet.size : 0
    const numerator = parentSize - planet.size
    const denomerator = parentSize
    const r = parentSize * (parentSize / 2) * ((numerator / denomerator))
    const theta = elapsedTime % (36000) / (numerator * 100 / denomerator)

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
      // const isNegCos = Math.cos(theta) < 0 ? true : false
      // const isNegSin = Math.sin(theta) < 0 ? true : false
      gradient = ctx.createLinearGradient(
        x + Math.cos(theta) * planet.size, 
        y + Math.sin(theta) * planet.size, 
        x - Math.cos(theta) * planet.size, 
        y - Math.sin(theta) * planet.size
      )


      // 50 < sunlight < 200 => 100

      // sunlight / 200

        // 0.025, 0.1

      // Add three color stops
      gradient.addColorStop(0, 'black')
      gradient.addColorStop(0.5, planet.color)
      gradient.addColorStop(1, brighten(planet.color))
    } 
    
    if (planet.id === parentId) {
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

function brighten(color: string): string {
  // 'rgb(0,0,0)'
  let output

  const commaSplit = color.split(',')
  const v1 = parseInt(commaSplit[0].slice(4, commaSplit[0].length))
  const v2 = parseInt(commaSplit[1])
  const v3 = parseInt(commaSplit[2].slice(0, commaSplit[2].length - 1))

  // technically irrelavant if colors generated are dark to begin with.
  const finalv1 = v1 <= 200 ? v1 + 55 : 255
  const finalv2 = v2 <= 200 ? v2 + 55: 255
  const finalv3 = v3 <= 200 ? v3 + 55 : 255

  return `rgb(${finalv1}, ${finalv2}, ${finalv3})`
}

let sunlight 

function guid() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function createPlanet(parentPlanet?: IPlanet): IPlanet {

  const planet = {
    id: guid(),
    position: {
      x: Math.floor((Math.random() * 300) + 3),
      y: Math.floor((Math.random() * 300) + 3),
    },
    size: Math.floor((Math.random() * 15) + 3),
    parentPlanet: parentPlanet,
    color: getRandomColor()
  }

  return planet
}
let parentId


function createStar(): IPlanet {

  const star = {
    id: guid(),
    position: {
      x: Math.floor((Math.random() * 1000) + 0),
      y: Math.floor((Math.random() * 1000) + 0),
    },
    size: Math.floor((Math.random() * 2) + 1),
    color: 'null'
  }

  star.color = `rgba(255,255,255, ${star.size === 2 ? '0.45' : '0.8'})` 


  return star
}

const startGameLoop = (canvas: any) => {

  // initialize planets
  const parentPlanet = createPlanet()
  parentPlanet.size = 25
  parentPlanet.position = {
    x: 475,
    y: 475
  }
  parentPlanet.color = '#ff995b'
  for (let i = 0; i < 15; ++i) {
    const planet = createPlanet(parentPlanet)
    planets[planet.id] = planet
  }
  planets[parentPlanet.id] = parentPlanet
  parentId = parentPlanet.id

  // initialize stars
  for (let i = 0; i < 200; ++i) {
    const star = createStar()
    stars[star.id] = star
  }

  return setInterval(runGame(canvas), 1000 / FPS)
}


function renderBackground(canvas: any) {

  Object.keys(stars).forEach(function (key) {
    const ctx = canvas.getContext("2d")
    const star = stars[key]
    
    ctx.beginPath()
    ctx.arc(star.position.x, star.position.y, star.size, 0, 2 * Math.PI)
    ctx.fillStyle = star.color
    ctx.fill()
    ctx.stroke()
  })
  return null
}

class App extends React.Component {
  canvas: any
  bgCanvas: any
  canvas2: any
  bgCanvas2: any
  canvas3: any
  bgCanvas3: any
  canvas4: any
  bgCanvas4: any
  gameLoop: any



  public componentDidMount() {
    this.gameLoop = startGameLoop(this.canvas)
    renderBackground(this.bgCanvas)

    this.gameLoop = startGameLoop(this.canvas2)
    renderBackground(this.bgCanvas2)

    this.gameLoop = startGameLoop(this.canvas3)
    renderBackground(this.bgCanvas3)

    this.gameLoop = startGameLoop(this.canvas4)
    renderBackground(this.bgCanvas4)
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <canvas id={'mainCanvas'} className={'mainCanvas'} width={width} height={height} ref={(ref) => this.canvas = ref} />
          <canvas id={'backgroundCanvas'} className={'backgroundCanvas'} width={width} height={height} ref={(ref) => this.bgCanvas = ref} />
        </div>
        <div>
          <canvas id={'mainCanvas2'} className={'mainCanvas'} width={width} height={height} ref={(ref) => this.canvas2 = ref} style={{left: '1000px'}} />
          <canvas id={'backgroundCanvas2'} className={'backgroundCanvas'} width={width} height={height} ref={(ref) => this.bgCanvas2 = ref} style={{left: '1000px'}} />
        </div>

                <div>
          <canvas id={'mainCanvas3'} className={'mainCanvas'} width={width} height={height} ref={(ref) => this.canvas3 = ref} style={{top: '1000px'}} />
          <canvas id={'backgroundCanvas3'} className={'backgroundCanvas'} width={width} height={height} ref={(ref) => this.bgCanvas3 = ref} style={{top: '1000px'}}/>
        </div>
        <div>
          <canvas id={'mainCanvas4'} className={'mainCanvas'} width={width} height={height} ref={(ref) => this.canvas4 = ref} style={{left: '1000px', top: '1000px'}} />
          <canvas id={'backgroundCanvas4'} className={'backgroundCanvas'} width={width} height={height} ref={(ref) => this.bgCanvas4 = ref} style={{left: '1000px', top: '1000px'}} />
        </div>
      </div>
    );
  }
}

export default App;
