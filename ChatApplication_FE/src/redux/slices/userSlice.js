import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  loggedin: false,
  userName: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userName=action.payload.userName;
      state.loggedin = true;
    },
    logout: (state) => {
        state.token = null
        state.loggedin = false;
        state.userName = null;
    },
  },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;