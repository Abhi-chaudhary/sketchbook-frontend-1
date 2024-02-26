import style from './index.module.css'
import { COLORS } from '../../constants';
import { useSelector,useDispatch } from 'react-redux';
import cx from 'classnames'
import { MENU_ITEMS } from '../../constants';
import { changeColor, changeSize } from '../../Slice/toolboxSlice';
import { socket } from '../../socket';

const Toolbox=()=>{
    const dispatch=useDispatch()
    const activeMenuItem = useSelector((state) => state.menu.menuItemClick)
    const {color,size} =useSelector((state)=>state.toolbox[activeMenuItem])
    const stroke=activeMenuItem === MENU_ITEMS.PENCIL
    const handleClick=(color)=>{
          dispatch(changeColor({item:activeMenuItem,color:color}))
          socket.emit('changeConfig', {color: color, size })
    }
    const handleChange=(e)=>{
        dispatch(changeSize({item:activeMenuItem,size:e.target.value}))
        socket.emit('changeConfig', {color, size: e.target.value })
    }
    return(
        <div className={style.toolbox}> 
           {stroke && <div className={style.colorbox}>
                <h4 className={style.heading}>Stroke</h4>
                <div className={style.colorwrapper}>
                <div className={cx(style.color,{[style.active]:color===COLORS.BLACK})} style={{backgroundColor:COLORS.BLACK}} onClick={()=>handleClick(COLORS.BLACK)}></div>
                <div className={cx(style.color,{[style.active]:color===COLORS.RED})} style={{backgroundColor:COLORS.RED}}onClick={()=>handleClick(COLORS.RED)}></div>
                <div className={cx(style.color,{[style.active]:color===COLORS.GREEN})} style={{backgroundColor:COLORS.GREEN}}onClick={()=>handleClick(COLORS.GREEN)}></div>
                <div className={cx(style.color,{[style.active]:color===COLORS.BLUE})} style={{backgroundColor:COLORS.BLUE}}onClick={()=>handleClick(COLORS.BLUE)}></div>
                <div className={cx(style.color,{[style.active]:color===COLORS.YELLOW})} style={{backgroundColor:COLORS.YELLOW}}onClick={()=>handleClick(COLORS.YELLOW)}></div>
                </div>
                
            </div>}
            <div>
                <h4 className={style.heading}>Size</h4>
                <div className={style.colorwrapper}>
                <input type="range" min={1} max={18} step={1} onChange={handleChange} value={size}></input>
                </div>
                
            </div>
        </div>
    )
}

export default Toolbox;