export interface IPosition {
  x: number
  y: number
}

export interface IPlanet {
  id: string
  position: IPosition
  parentPlanet?: IPlanet
  size: number
  color: string
}


export interface ISize {
  width: number,
  height: number
}


export interface ISystem {
  centralStar: IPlanet
  planets: Map<string, IPlanet>
}

export interface IGalaxy {
  systems: Array<ISystem>
}