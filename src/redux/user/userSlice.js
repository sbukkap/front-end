import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currUser:null,
    err:null,
    loading:false,
    clientSecret:null
}

const userSlice = createSlice({
    name:'user_mod',
    initialState,
    reducers: {
        beginingSignin: (state) => {
            state.loading = true;
        },

        signInSuccess: (state,action) => {
                state.currUser = action.payload;
                state.loading = false;
                state.err = null;
        },
        FailedSign: (state,action) => {
            state.err = action.payload;
            state.loading = false;
        },
        setClientSecret: (state,action) => {
            state.clientSecret = action.payload;
        }

    }
});

export const {signInSuccess,beginingSignin,FailedSign,setClientSecret} = userSlice.actions;

export default userSlice.reducer;