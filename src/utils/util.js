
export function getEllipseText(str = '',limit = 100){
  return limit >= str.length ? str : str.substr(0,limit) + '...'
}
