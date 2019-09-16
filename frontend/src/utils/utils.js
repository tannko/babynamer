const TOKEN_KEY = 'user';

export const isLogin = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }

  return false;
}

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
}

export const login = user => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
}

export const getUserName = () => {
  if (isLogin()) {
    let user = JSON.parse(localStorage.getItem(TOKEN_KEY));
    return user.name;
  }
  return null;
}

export const getUser = () => {
  let user;
  if (isLogin()) {
    user = JSON.parse(localStorage.getItem(TOKEN_KEY));
  }
  return user;
}

export const objectToMap = (object) => {
    let map = new Map();
    for (let k of Object.keys(object)) {
      map.set(k, object[k]);
    }
    return map;
}

export const areMapsEqual = (map1, map2) => {
  if (map1.size !== map2.size) {
    return false;
  }
  map1.forEach((rating, name) => {
    if (map2.get(name) !== rating) {
      return false;
    }
  });
  return true;
}
