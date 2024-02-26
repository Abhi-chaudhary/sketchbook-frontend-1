import {configureStore} from '@reduxjs/toolkit'
import menuSlice from './Slice/menuSlice'
import toolboxSlice from './Slice/toolboxSlice'
export const store =configureStore(
{
    reducer:{
            menu:menuSlice,
            toolbox:toolboxSlice
    }
})