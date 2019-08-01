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
