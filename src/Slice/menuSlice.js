import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS } from "../constants";
 const initialState={
     "menuItemClick":MENU_ITEMS.PENCIL,
     "actionItemClick":null
 }

export const menuSlice=createSlice({
name:"menu",
initialState,
reducers:{
    handleMenuItemClick:(state,action)=>{
        state.menuItemClick=action.payload  
       
    },
    handleActionItemClick:(state,action)=>{
        state.actionItemClick=action.payload
    }

}

})

export const {handleMenuItemClick,handleActionItemClick}=menuSlice.actions
export default menuSlice.reducer 