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