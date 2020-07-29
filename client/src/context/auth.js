import React, { useReducer, createContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

async function tokenCheck() {
  if (await AsyncStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(await AsyncStorage.getItem('jwtToken'));
    if (decodedToken.exp * 1000 < Date.now()) {
      await AsyncStorage.removeItem('jwtToken');
    } else {
      initialState.user = decodedToken;
    }
    console.log(decodedToken);
  }
}

tokenCheck()

const AuthContext = createContext({
  user: null,
  login: (userData) => { },
  logout: () => { }
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  async function login(userData) {
    await AsyncStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  async function logout() {
    await AsyncStorage.clear();
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
