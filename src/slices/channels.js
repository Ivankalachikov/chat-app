/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';
import DEFAULT_CHANNEL_ID from '../constants.js';
import { getAuth } from '../context/index.js';

export const setInitialState = createAsyncThunk(
  'channelsInfo/setInitialState',
  async (thunkAPI) => {
    const url = routes.data();
    const { token } = getAuth();
    try {
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  channels: [],
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload.id;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload.channel);
    },
    removeChannel: (state, action) => {
      const newChannels = state.channels.filter(({ id }) => id !== action.payload.id);
      state.channels = newChannels;
      state.currentChannelId = DEFAULT_CHANNEL_ID;
    },
    renameChannel: (state, action) => {
      const { id: renamedChannelId, name: newName } = action.payload.channel;
      const renamedChannel = state.channels.find(({ id }) => id === renamedChannelId);
      renamedChannel.name = newName;
    },
  },
  extraReducers: {
    [setInitialState.fulfilled]: (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
    },
  },
});

const { reducer, actions } = channelsSlice;
export { actions };
export default reducer;
