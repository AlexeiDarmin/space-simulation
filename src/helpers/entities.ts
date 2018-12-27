import { IPlanet } from 'src/models';
import { getRandomColor } from './drawing';
import { guid } from './misc';
import { MAX_PLANET_SIZE } from 'src/constants';


export function createPlanet(parentPlanet: IPlanet, width: number, height: number): IPlanet {

  const planet = {
    id: guid(),
    position: {
      x: Math.floor((Math.random() * width) + 3),
      y: Math.floor((Math.random() * height) + 3),
    },
    size: Math.floor((Math.random() * MAX_PLANET_SIZE / 3) + 3),
    parentPlanet: parentPlanet,
    color: getRandomColor()
  }

  return planet
}



export function createStar(width: number, height: number): IPlanet {

  const star = {
    id: guid(),
    position: {
      x: Math.floor((Math.random() * width) + 0),
      y: Math.floor((Math.random() * height) + 0),
    },
    size: Math.floor((Math.random() * 2) + 1),
    color: 'null'
  }

  star.color = `rgba(255,255,255, ${star.size === 2 ? '0.45' : '0.8'})` 


  return star
}