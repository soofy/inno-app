import './DrawComponent.css';
import Button from '@mui/material/Button';

import {useEffect, useRef, useState} from 'react';
import axios from 'axios';

const DrawRectangle = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState('RECTANGLE');
    const [currentColor, setCurrentColor] = useState('BLUE');


    const canvasOffSetX = useRef(null);
    const canvasOffSetY = useRef(null);
    const startX = useRef(null);
    const startY = useRef(null);

    useEffect(() => {

        debugger;
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth > 1400 ? 2200 : 1200;
        canvas.height = window.innerHeight > 1200 ?800 : 400;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = currentColor;
        context.lineWidth = 1;
        contextRef.current = context;

        const canvasOffSet = canvas.getBoundingClientRect();
        canvasOffSetX.current = canvasOffSet.top
        canvasOffSetY.current = canvasOffSet.left
        console.log(canvasOffSet);
        console.log( canvasOffSetY.current);
    }, []);

    const startDrawing = ({nativeEvent}) => {
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();
        // console.log( startX.current , nativeEvent.clientX , canvasOffSetX.current);
        // console.log( startY.current , nativeEvent.clientY , canvasOffSetY.current);

        startX.current = nativeEvent.clientX - canvasOffSetX.current;
        startY.current = nativeEvent.clientY - canvasOffSetY.current;
        contextRef.current.strokeStyle = currentColor;
        setIsDrawing(true);
    };
    
     const drawShape = (nativeEvent) =>{
        switch (currentShape) {
            case 'RECTANGLE':
                drawRectangle(nativeEvent);
                break;
            case 'CIRCLE':
                    drawCircle(nativeEvent);
                    break;
            case 'LINE':
                    drawLine(nativeEvent);
                    break;
            case 'TRIANGLE':
                drawTriangle(nativeEvent);
                    break;
            default:
                    break;
        }
    };

    const drawRectangle = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        const rectWidth = newMouseX - startX.current;
        const rectHeight = newMouseY - startY.current;

        //contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        contextRef.current.beginPath();

        contextRef.current.strokeRect(startX.current, startY.current, rectWidth, rectHeight);
        contextRef.current.closePath();

    };

    const drawCircle = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        // const rectWidth = newMouseX - startX.current;
        // const rectHeight = newMouseY - startY.current;

        const radius = Math.hypot(startX.current - newMouseX, startY.current - newMouseY);
        contextRef.current.beginPath();
        contextRef.current.arc(startX.current, startY.current, radius, 0* Math.PI, 2 * Math.PI);
        contextRef.current.stroke(); 
        contextRef.current.closePath();

    };

    
    const drawLine = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        contextRef.current.beginPath();
        contextRef.current.moveTo(startX.current, startY.current);
        contextRef.current.lineTo(newMouseX, newMouseY);
        contextRef.current.stroke(); 
        contextRef.current.closePath();

    };

    
    const drawTriangle = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const newMouseX = nativeEvent.clientX - canvasOffSetX.current;
        const newMouseY = nativeEvent.clientY - canvasOffSetY.current;

        contextRef.current.beginPath();
        contextRef.current.moveTo(startX.current, startY.current);
        contextRef.current.lineTo(newMouseX, newMouseY);
        contextRef.current.stroke(); 

        contextRef.current.lineTo(startX.current, newMouseY);
        contextRef.current.stroke(); 

        contextRef.current.lineTo(startX.current, startY.current);
        contextRef.current.stroke(); 

        contextRef.current.closePath();
    };

    const stopDrawingRectangle = () => {
        setIsDrawing(false);
    };

     const handleClear  = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    }

    const handleRandomShape  = () => {

        axios.get(`http://localhost:3001/api/shapes?current=${currentShape}`)
        .then(res => {
          const shape = res.data;
          setCurrentShape(shape);
        })
    }

    const handleRandomColor  = () => {
        axios.get(`http://localhost:3001/api/colors?current=${currentColor}`)
        .then(res => {
          const color = res.data;
          setCurrentColor( color );
        })
    }

    return (
        <div className='content'>
    
            <canvas className="canvas-container-rect"
                ref={canvasRef}
                onMouseDown={startDrawing}
                // onMouseMove={drawShape}
                onMouseUp={drawShape}
                onMouseLeave={stopDrawingRectangle}>
            </canvas>
            <div className='buttons'>
                <div className='child'> <Button variant="contained" onClick={handleClear}>Reset</Button> </div>
                <div className='child'> <Button variant="contained" onClick={handleRandomShape}>Random Shape</Button></div>
                <div className='child'><Button variant="contained" onClick={handleRandomColor}>Random Color</Button></div>
            </div>
        </div>
    )
}

export default DrawRectangle;