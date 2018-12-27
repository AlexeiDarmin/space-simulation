import * as React from 'react';
import './App.css';

import { IPlanet, ISize, ISystem } from './models';
import { startGameLoop, startGameLoop2, initializeSystem, initializeStars } from './simulation';
import { renderBackground } from './helpers/drawing';

export interface IState {
  canvasSize: ISize
  system: ISystem
  stars: Map<string, IPlanet>
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
    system: null,
    stars: null,
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    const system = initializeSystem(() => this.state)
    const system2 = initializeSystem(() => this.state)
    const system3 = initializeSystem(() => this.state)
    const system4 = initializeSystem(() => this.state)

    const galaxy = {
      systems: [system, system2, system3, system4]
    }

    const stars = initializeStars(() => this.state)

    // this.gameLoop = startGameLoop(this.canvas, () => this.state, system)
    this.gameLoop = startGameLoop2(this.canvas, () => this.state, galaxy)
    renderBackground(this.bgCanvas, stars)

    this.setState({
      system,
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
