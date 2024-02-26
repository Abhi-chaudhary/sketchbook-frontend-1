import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import style from './index.module.css'
import { useDispatch,useSelector } from 'react-redux'
import { MENU_ITEMS } from '../../constants'
import { handleMenuItemClick,handleActionItemClick } from '../../Slice/menuSlice'
import cx from 'classnames'
import { socket } from '../../socket'
import { useEffect } from 'react'
const Menu=()=>{
    const dispatch =useDispatch()
    const value=useSelector((state)=> state.menu.menuItemClick)
    const value2=useSelector((state)=> state.menu.actionItemClick)
    
    const handleClick=(itemName)=>{

        
        const handleKrde=(config)=>{
            dispatch(handleMenuItemClick(config.item))
        }
        
        socket.emit('krde',{item:itemName})


        socket.on('krde',handleKrde)
        dispatch(handleMenuItemClick(itemName))
    }

    useEffect(()=>{
        const handleKrde=(config)=>{
            dispatch(handleMenuItemClick(config.item))
        }
        socket.on('krde',handleKrde)
        
    },[value])

    useEffect(()=>{
        const handleKrde2=(config)=>{
            dispatch(handleActionItemClick(config.item))
        }
        socket.on('krde2',handleKrde2)
        console.log(value2)
    },[value2])

    const handleActionClick=(itemName)=>{

        const handleKrde2=(config)=>{
            dispatch(handleActionItemClick(config.item))
        }
        
        socket.emit('krde2',{item:itemName})


        socket.on('krde2',handleKrde2)

         dispatch(handleActionItemClick(itemName))
    }
    return(
        <div className={style.menu}>
             <div className={cx(style.menuItem,{[style.active]:value===MENU_ITEMS.PENCIL})} onClick={()=>handleClick(MENU_ITEMS.PENCIL)}>
             <FontAwesomeIcon icon={faPencil} className={style.icon}/>
             </div>
             <div className={cx(style.menuItem,{[style.active]:value===MENU_ITEMS.ERASER})}onClick={()=>handleClick(MENU_ITEMS.ERASER)}>
             <FontAwesomeIcon icon={faEraser} className={style.icon}/>
             </div>
             <div className={style.menuItem} onClick={()=>handleActionClick(MENU_ITEMS.UNDO)}>
             <FontAwesomeIcon icon={faRotateLeft} className={style.icon} />
             </div>
             <div className={style.menuItem} onClick={()=>handleActionClick(MENU_ITEMS.REDO)}>
             <FontAwesomeIcon icon={faRotateRight} className={style.icon}/>
             </div>
             <div className={style.menuItem} onClick={()=>handleActionClick(MENU_ITEMS.DOWNLOAD)}>
             <FontAwesomeIcon icon={faFileArrowDown} className={style.icon}/>
             </div>
        </div>
    )
}
export default Menu;

