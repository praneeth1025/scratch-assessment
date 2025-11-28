import React ,{useState} from "react";
import Icon from "./Icon";

export default function MidArea({actions , setActions , spriteName}) {

  // const [actions , setActions] = useState([]);


  const handleDrop = (e) => {
    e.preventDefault();

    const actionType = e.dataTransfer.getData('actionType');

    let newAction = {id:Date.now()};

    switch(actionType) {
      case 'MOVE':
        newAction = {...newAction , type:'MOVE' , value: 10 , text:'Steps'};
        break;
      case 'TURN_ANTICLOCKWISE':
        newAction = {...newAction , type:'TURN_ANTICLOCKWISE' , value: 15 , text:'Degrees'};
        break;
      case 'TURN_CLOCKWISE':
        newAction = {...newAction , type:'TURN_CLOCKWISE' , value: 15 , text:'Degrees'};
        break;
      case 'GOTO_XY':
        newAction = {...newAction , type:'GOTO_XY' , x:0 , y:0};
        break;
      case 'SAY':
        newAction = {...newAction , type:'SAY' , text:'Hello!' , duration:2};
        break;
      case 'THINK':
        newAction = {...newAction , type:'THINK' , text:'Hmm...' , duration:2};
        break;
      case 'REPEAT':
        newAction = {...newAction , type:'REPEAT'};
        break;
      default:
        return;
    }

    setActions([...actions , newAction]);
  }


  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleInputChange = (actionId , inputType , value) =>{
    setActions(actions.map((action) => action.id === actionId ? {...action , [inputType]: value} : action));
  }

  const handleDelete = (actionId) =>{
    setActions(actions.filter((action) => action.id !== actionId));
  }



  // Render each action based on its type
const renderAction = (action) => {
  switch(action.type) {
    case 'MOVE':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Move</span>
          <input
            type="number"
            value={action.value}
            onChange={(e) => handleInputChange(action.id, 'value', parseInt(e.target.value) || 0)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>steps</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'TURN_CLOCKWISE':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Turn</span>
          <Icon name="redo" size={15} className="text-white mx-1" />
          <input
            type="number"
            value={action.value}
            onChange={(e) => handleInputChange(action.id, 'value', parseInt(e.target.value) || 0)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>degrees</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'TURN_ANTICLOCKWISE':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Turn</span>
          <Icon name="undo" size={15} className="text-white mx-1" />
          <input
            type="number"
            value={action.value}
            onChange={(e) => handleInputChange(action.id, 'value', parseInt(e.target.value) || 0)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>degrees</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'GOTO_XY':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Go to x:</span>
          <input
            type="number"
            value={action.x}
            onChange={(e) => handleInputChange(action.id, 'x', parseInt(e.target.value) || 0)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>y:</span>
          <input
            type="number"
            value={action.y}
            onChange={(e) => handleInputChange(action.id, 'y', parseInt(e.target.value) || 0)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'SAY':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Say</span>
          <input
            type="text"
            value={action.text}
            onChange={(e) => handleInputChange(action.id, 'text', e.target.value)}
            className="bg-white text-black px-2 mx-2 rounded"
          />
          <span>for</span>
          <input
            type="number"
            value={action.duration}
            onChange={(e) => handleInputChange(action.id, 'duration', parseInt(e.target.value) || 1)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>seconds</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'THINK':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Think</span>
          <input
            type="text"
            value={action.text}
            onChange={(e) => handleInputChange(action.id, 'text', e.target.value)}
            className="bg-white text-black px-2 mx-2 rounded"
          />
          <span>for</span>
          <input
            type="number"
            value={action.duration}
            onChange={(e) => handleInputChange(action.id, 'duration', parseInt(e.target.value) || 1)}
            className="bg-white text-black px-2 mx-2 rounded w-16 text-center"
          />
          <span>seconds</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    case 'REPEAT':
      return (
        <div key={action.id} className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded items-center">
          <span>Repeat animation</span>
          <button 
            onClick={() => handleDelete(action.id)}
            className="ml-2 bg-red-500 hover:bg-red-600 px-2 rounded font-bold"
          >
            ×
          </button>
        </div>
      );

    default:
      return null;
  }
};
  return ( 
    <div
    className="flex-1 h-full overflow-auto"
    onDrop={handleDrop}
    onDragOver={handleDragOver}
    >
      <h2 className="text-lg font-bold mb-4">{spriteName ? `${spriteName} Actions` : 'Sprite Actions'}</h2>
      {actions.length === 0 ? (<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
        Drop animation blocks here
      </div>) : (
        <div className="space-y-2"> 
          {actions.map((action) => (
            renderAction(action)
          ))}
        </div>
      )}
      
    </div>
    
    );
}
