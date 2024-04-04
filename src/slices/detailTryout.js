import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //initial value berguna seperti react.usstate yang memberikan nilai default pada state
  resultDT:[]
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    //reducer berguna untuk mengubah nilai dari  state yang awal menjadi hasil terkini dari sebuah proses di page lain
    setResultDT: (state, action) => {
      state.resultDT = {...state.resultDT, [action.payload.idDetailTO]:action.payload.data};
      
    },
  }, 
});

// kita export si setter agar bisa diakses di halaman lain
export const {
 setResultDT
} = counterSlice.actions;

export default counterSlice.reducer;
