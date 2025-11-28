import React from "react";
import Icon from "./Icon";

export default function Sidebar() {

  const handleDragStart = (e , actionType) => {
    e.dataTransfer.setData('actionType', actionType);
  }



  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      <div draggable onDragStart={(e) => handleDragStart(e, 'MOVE')} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Move 10 steps"}
      </div>
      <div  draggable onDragStart={(e) => handleDragStart(e, 'TURN_CLOCKWISE')} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div draggable onDragStart={(e) => handleDragStart(e, 'TURN_ANTICLOCKWISE')} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div  draggable onDragStart={(e) => handleDragStart(e, 'GOTO_XY')} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"Go To X:0 y:0"}
        {/* controls section */}
        

      </div>
      <div className="font-bold"> {"Looks"} </div>
      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, 'SAY')}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        >
          {"Say Hello! for 2 seconds"}
      </div>
      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, 'THINK')}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        >
          {"Think Hmm... for 2 seconds"}
      </div>
      {/* COntorl section  */}
      <div className="font-bold"> {"Controls"} </div>
      <div 
        draggable 
        onDragStart={(e) => handleDragStart(e, 'REPEAT')}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
       >
        {"Repeat animation"}
      </div>
        
    </div>
  );
}
