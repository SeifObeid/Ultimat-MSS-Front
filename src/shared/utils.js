export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export function checkRoles(pageName, roleName) {
  let roles = JSON.parse(window.localStorage.getItem("roles"))
  if (roles) {
    let rolePage = roles.filter(x => x.name == pageName);
    if (rolePage.length > 0 && rolePage) {
      let actions = rolePage[0].actions;
      let actionPage = actions.filter(x => x == roleName);
      if (actionPage && actionPage.length > 0) {
        return true
      } else {
        return false
      }
    }
  } else {
    return false
  }
}


export function checkPagePermession(pageName) {
  //return true;
  let roles = JSON.parse(window.localStorage.getItem("roles"))
  // console.log(window.localStorage.getItem("roles"));
  if (roles) {
    let rolePage = roles.filter(x => x.name == pageName);
    if (rolePage.length > 0 && rolePage) {
      // console.log(rolePage)
      return true
    } else {
      return false
    }
  }else{
    return false
  }
}