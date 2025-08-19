import React, { useState } from 'react'

import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCanvasType } from '@/redux/slices/canvasSlice';

const HoverHeader = () => {

  const dispatch= useDispatch<AppDispatch>();
  const [activeButton, setActiveButton] = useState<'view' | 'chat'>('view');
  
  const handleHover = () => {
    dispatch(setCanvasType("hover"));
    setActiveButton('view');
  };

  const handleChat = () => {
    // Handle chat action here
    dispatch(setCanvasType("hover-default"));
    setActiveButton('chat');
    console.log("Chat action triggered");
  };
  return (
    <>
       <Card>
                <CardContent className="py-2 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                       <Button 
                         variant={activeButton === 'view' ? "default" : "outline"} 
                         size="sm"
                         onClick={handleHover}
                       >
                          View
                        </Button>
                        <Button 
                         variant={activeButton === 'chat' ? "default" : "outline"} 
                         size="sm"
                         onClick={handleChat}
                        >
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
    </>
  )
}

export default HoverHeader