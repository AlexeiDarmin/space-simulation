import * as React from 'react';
import './App.css';

import { IPlanet, ISize } from './models';
import { startGameLoop, initializePlanets, initializeStars } from './simulation';
import { renderBackground } from './helpers/drawing';

export interface IState {
  canvasSize: ISize
  planets: Map<string, IPlanet>
  stars: Map<string, IPlanet>
  sunlight: number
  parentId: string
}

class App extends React.Component<{}, IState> {
  canvas: any
  bgCanvas: any
  gameLoop: any

  state: IState = {
    canvasSize: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    planets: null,
    stars: null,
    sunlight: null,
    parentId: null
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    const planets = initializePlanets(() => this.state)
    const stars = initializeStars(() => this.state)

    this.gameLoop = startGameLoop(this.canvas, () => this.state, planets)
    renderBackground(this.bgCanvas, stars)

    this.setState({
      planets,
      stars
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      canvasSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  public render() {
    const { canvasSize: { width, height } } = this.state

    return (
      <div className="App">
        <div>
          <canvas id={'mainCanvas'} className={'mainCanvas'} width={width} height={height} ref={(ref) => this.canvas = ref} />
          <canvas id={'backgroundCanvas'} className={'backgroundCanvas'} width={width} height={height} ref={(ref) => this.bgCanvas = ref} />
        </div>
      </div>
    );
  }
}

export default App;
