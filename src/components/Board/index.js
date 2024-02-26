import React from "react";
import { useRef,useEffect,useLayoutEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { MENU_ITEMS } from "../../constants";
import { handleActionItemClick } from "../../Slice/menuSlice";
import { socket } from "../../socket";
const Board=()=>{
    const dispatch=useDispatch()
    const drawHistory1 = useRef([])
    const drawHistory2 = useRef([])
    const historyPointer = useRef(0)
    const canvasRef=useRef(null);
    const shuldDraw=useRef(false);
    const activeItem=useSelector((state)=>state.menu.menuItemClick)
    const actionItem=useSelector((state)=>state.menu.actionItemClick)
    const {color,size} =useSelector((state)=>state.toolbox[activeItem])
    console.log(color,size)

    useEffect(() => {
        if(!canvasRef.current)return
        const canvas=canvasRef.current
        const context =canvas.getContext('2d');

        if(actionItem===MENU_ITEMS.DOWNLOAD)
        {
             const URL=canvas.toDataURL()
             const anchor=document.createElement('a')
             anchor.href=URL;
             anchor.download='sketch.jpg'
             anchor.click()

        }
        if(actionItem===MENU_ITEMS.UNDO)
        {
                 if(historyPointer.current!==0)
                 {
                    drawHistory2.current.push(drawHistory1.current.pop())
                    historyPointer.current=drawHistory1.current.length-1
                    const imgData=drawHistory1.current[historyPointer.current]
                    context.putImageData(imgData,0,0)

                 }
                 console.log(drawHistory1)
        }
        if(actionItem===MENU_ITEMS.REDO)
        {
           if(drawHistory2.current.length!==0)
           {
              drawHistory1.current.push(drawHistory2.current.pop())
              historyPointer.current=drawHistory1.current.length-1
              const imgData=drawHistory1.current[historyPointer.current]
              context.putImageData(imgData,0,0)
           }
        }
        dispatch(handleActionItemClick(null))
        
      
    }, [actionItem])
    

    useEffect(()=>{
        if(!canvasRef.current)return
        const canvas=canvasRef.current
        const context =canvas.getContext('2d');

        const changeConfig = (color, size) => {
            context.strokeStyle = color
            context.lineWidth = size
        }

        const handleChangeConfig = (config) => {
           
            changeConfig(config.color, config.size)
        }
        changeConfig(color, size)
        socket.on('changeConfig', handleChangeConfig)

        return () => {
            socket.off('changeConfig', handleChangeConfig)
        }
        

    },[color,size])

   useLayoutEffect(()=>{
    if(!canvasRef.current)return
    const canvas=canvasRef.current
    const context =canvas.getContext('2d');
    
      canvas.width=window.innerWidth
      canvas.height=window.innerHeight


      const beginPath = (x, y) => {
        context.beginPath()
        context.moveTo(x, y)
    }

    const drawLine = (x, y) => {
        context.lineTo(x, y)
        context.stroke()
    }
    const handleMouseDown = (e) => {
        shuldDraw.current = true
        beginPath(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY)
        socket.emit('beginPath', {x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY})
    }

    const handleMouseMove = (e) => {
        if (!shuldDraw.current) return
        drawLine(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY)
        socket.emit('drawLine', {x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY})
    }

        const dataentry=()=>{
            const imageData=context.getImageData(0,0,canvas.width,canvas.height)
            drawHistory1.current.push(imageData)
            drawHistory2.current=[]
            historyPointer.current=drawHistory1.current.length-1 
        }

      const handleMouseUp=()=>{
        shuldDraw.current=false
        
        dataentry()

        console.log('mouseup')
        socket.emit('dataentry',{})
      }

      const handleBeginPath = (path) => {
        beginPath(path.x, path.y)
    }

    const handleDrawLine = (path) => {
        drawLine(path.x, path.y)
    }

    const handleDataEntry=(d)=>{
         dataentry(d.i)
    }

       canvas.addEventListener('mousedown',handleMouseDown);
       canvas.addEventListener('mousemove',handleMouseMove);
       canvas.addEventListener('mouseup',handleMouseUp);

       canvas.addEventListener('touchstart', handleMouseDown)
       canvas.addEventListener('touchmove', handleMouseMove)
       canvas.addEventListener('touchend', handleMouseUp)

       socket.on('beginPath', handleBeginPath)
       socket.on('drawLine', handleDrawLine)
       socket.on('dataentry',handleDataEntry)
   
       return () => {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseup', handleMouseUp)

        canvas.removeEventListener('touchstart', handleMouseDown)
        canvas.removeEventListener('touchmove', handleMouseMove)
        canvas.removeEventListener('touchend', handleMouseUp)

        socket.off('beginPath', handleBeginPath)
        socket.off('drawLine', handleDrawLine)
    }

   },[])

    return(
        <canvas ref={canvasRef} ></canvas>
    )
}

export default Board