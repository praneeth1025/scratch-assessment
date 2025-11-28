import React , {useState} from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {

  const [actions , setActions] = useState([]);

  const [sprites , setSprites] = useState([
    {id:1 , name:"Sprite 1" , actions:[] , position:{x:0, y:0} , rotation:0},
  ]);

  const [selectedSpriteId , setSelectedSpriteId] = useState(1);

  const selectedSprite = sprites.find(sprite => sprite.id === selectedSpriteId);

  const updateSpriteActions = (newActions) => {
    console.log('Updating sprite', selectedSpriteId, 'with actions:', newActions);
    setSprites(sprites.map(sprite => sprite.id === selectedSpriteId ? {...sprite , actions:newActions} : sprite));
  }

  const addSprite = () => {
    const newId = sprites.length > 0 ? Math.max(...sprites.map(s => s.id)) + 1 : 1;
    
    // Position new sprites offset from center to avoid immediate collision
    const offset = sprites.length * 100; // 80 pixels apart
    
    const newSprite = {
      id: newId,
      name: `Sprite ${newId}`,
      actions: [],
      position: { x: 0, y: offset }, // Offset each new sprite
      rotation: 0
    };

    console.log('Adding sprite:', newSprite);
    console.log('Current sprites:', sprites);

    setSprites([...sprites, newSprite]);
    setSelectedSpriteId(newId);
  }

  const deleteSprite = (spriteId) => {
    if (sprites.length === 1) {
      alert("Cannot delete the last sprite!");
      return;
    }
    const newSprites = sprites.filter(sprite => sprite.id !== spriteId);
    setSprites(newSprites);
    // If deleted sprite was selected, select the first one
    if (selectedSpriteId === spriteId) {
      setSelectedSpriteId(newSprites[0].id);
    }
  };
  console.log("Actions in App " , actions);
  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar /> 
          <MidArea actions={selectedSprite ? selectedSprite.actions : []}
            setActions={updateSpriteActions}
            spriteName={selectedSprite ? selectedSprite.name : ""} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites}
            setSprites={setSprites}
            selectedSpriteId={selectedSpriteId}
            setSelectedSpriteId={setSelectedSpriteId}
            addSprite={addSprite}
            deleteSprite={deleteSprite}/>
        </div>
      </div>
    </div>
  );
}
