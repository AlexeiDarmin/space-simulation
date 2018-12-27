import { IPlanet } from 'src/models';

export function shadeRGBColor(color, percent) {
  var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

export function blendRGBColors(c0, c1, p) {
  var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
}

export function getRandColor(){
  const divisionFactor = 2
  // Six levels of brightness from 0 to 5, 0 being the darkest
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  var mixedrgb = [rgb[0] / divisionFactor, rgb[1] / divisionFactor, rgb[2] / divisionFactor].map(function(x){ return Math.round(x/2.0)})
  return "rgb(" + mixedrgb.join(",") + ")";
}


export function getRandomColor() {
  const color = getRandColor()

  return color
}



export function brighten(color: string): string {
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

export function darken(color: string): string {
  const commaSplit = color.split(',')
  const v1 = parseInt(commaSplit[0].slice(4, commaSplit[0].length))
  const v2 = parseInt(commaSplit[1])
  const v3 = parseInt(commaSplit[2].slice(0, commaSplit[2].length - 1))

  // technically irrelavant if colors generated are dark to begin with.
  const finalv1 = v1 <= 55 ? 0: v1 - 55 
  const finalv2 = v2 <= 55 ? 0 : v2 - 55
  const finalv3 = v3 <= 55 ? 0 : v3 - 55

  return `rgb(${finalv1}, ${finalv2}, ${finalv3})`
}


export function renderBackground(canvas: any, stars: Map<string, IPlanet>) {
  stars.forEach(star => {
    const ctx = canvas.getContext("2d")
    
    ctx.beginPath()
    ctx.arc(star.position.x, star.position.y, star.size, 0, 2 * Math.PI)
    ctx.fillStyle = star.color
    ctx.fill()
    ctx.stroke()
  })
  return null
}
