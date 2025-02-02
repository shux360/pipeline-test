import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentRole: 'ADMIN',
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setCurrentRole: (state, action) => {
            state.currentRole = action.payload;
        },
    },
});

export const {setCurrentRole } = roleSlice.actions;

export default roleSlice.reducer;