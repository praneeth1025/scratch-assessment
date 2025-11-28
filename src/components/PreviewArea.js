import React , {useState , useRef} from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({sprites, setSprites, selectedSpriteId, setSelectedSpriteId, addSprite, deleteSprite }) {

  const [isPlaying , setIsPlaying] = useState(false);
  const [speechBubbles , setSpeechBubbles] = useState({});
  const isPlayingRef = useRef(false);
  const [collisionState, setCollisionState] = useState(null);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const updateSpriteState = (spriteId , updates) =>{
    setSprites(sprites.map(sprite => sprite.id === spriteId ? {...sprite , ...updates} : sprite));
  }

  const resetAllSprites = () => {
    // setIsPlaying(false);
    // isPlayingRef.current = false;
    setSprites(sprites.map(sprite => ({
      ...sprite,
      position: { x: 0, y: 0 },
      rotation: 0
    })));
    setSpeechBubbles({});
  };

  const executeActionsForSprite = async (sprite) =>{
    if (!sprite.actions || sprite.actions.length === 0) {
      return;
    }

    let currentX = sprite.position.x;
    let currentY = sprite.position.y;
    let currentRotation = sprite.rotation;

    const actionsList = sprite.actions.filter(action => action.type !== 'REPEAT');
    const hasRepeat = sprite.actions.some(action => action.type === 'REPEAT');

    const runActions = async () => {
      for (let action of actionsList) {
        switch (action.type) {
          case 'MOVE':
            const radians = (currentRotation * Math.PI) / 180;
            const moveX = action.value * Math.cos(radians);
            const moveY = action.value * Math.sin(radians);
            currentX += moveX;
            currentY -= moveY;
            updateSpriteState(sprite.id, { position: { x: currentX, y: currentY } });
            await sleep(500);
            
            // Check collision after MOVE
            const moveSpriteState = {
              ...sprite,
              position: { x: currentX, y: currentY },
              rotation: currentRotation
            };
            
            for (let otherSprite of sprites) {
              if (otherSprite.id !== sprite.id) {
                if (checkCollision(moveSpriteState, otherSprite)) {
                  console.log(`💥 COLLISION! ${sprite.name} hit ${otherSprite.name}!`);
                  setCollisionState({
                    sprite1: sprite.id,
                    sprite2: otherSprite.id,
                    message: `${sprite.name} collided with ${otherSprite.name}!`
                  });
                  await sleep(300);
                  swapSpriteActions(sprite.id, otherSprite.id);
                  setTimeout(() => setCollisionState(null), 2000);
                  setIsPlaying(false);
                  return;
                }
              }
            }
            break;
    
          case 'TURN_ANTICLOCKWISE':
            currentRotation -= action.value;
            updateSpriteState(sprite.id, { rotation: currentRotation });
            await sleep(500);
            break;
    
          case 'TURN_CLOCKWISE':
            currentRotation += action.value;
            updateSpriteState(sprite.id, { rotation: currentRotation });
            await sleep(500);
            break;
    
          case 'GOTO_XY':
            currentX = action.x;
            currentY = action.y;
            updateSpriteState(sprite.id, { position: { x: currentX, y: currentY } });
            await sleep(500);
            
            // Check collision after GOTO
            const gotoSpriteState = {
              ...sprite,
              position: { x: currentX, y: currentY },
              rotation: currentRotation
            };
            
            for (let otherSprite of sprites) {
              if (otherSprite.id !== sprite.id) {
                if (checkCollision(gotoSpriteState, otherSprite)) {
                  console.log(`💥 COLLISION! ${sprite.name} hit ${otherSprite.name}!`);
                  setCollisionState({
                    sprite1: sprite.id,
                    sprite2: otherSprite.id,
                    message: `${sprite.name} collided with ${otherSprite.name}!`
                  });
                  await sleep(300);
                  swapSpriteActions(sprite.id, otherSprite.id);
                  setTimeout(() => setCollisionState(null), 2000);
                  setIsPlaying(false);
                  return;
                }
              }
            }
            break;
    
          case 'SAY':
            setSpeechBubbles(prev => ({
              ...prev,
              [sprite.id]: { text: action.text, type: 'say' }
            }));
            await sleep(action.duration * 1000);
            setSpeechBubbles(prev => {
              const newBubbles = { ...prev };
              delete newBubbles[sprite.id];
              return newBubbles;
            });
            break;
    
          case 'THINK':
            setSpeechBubbles(prev => ({
              ...prev,
              [sprite.id]: { text: action.text, type: 'think' }
            }));
            await sleep(action.duration * 1000);
            setSpeechBubbles(prev => {
              const newBubbles = { ...prev };
              delete newBubbles[sprite.id];
              return newBubbles;
            });
            break;
    
          default:
            break;
        }
      }
    
      // Repeat after all actions complete
      if (hasRepeat && isPlayingRef.current) {
        await runActions();
      }
    };

    await runActions();
  }


  const handlePlay = async () => {
    resetAllSprites();
    setIsPlaying(true);
    isPlayingRef.current = true;
    const promises = sprites.map(sprite => executeActionsForSprite(sprite));
    await Promise.all(promises);

  }

  const checkCollision = (sprite1, sprite2) => {
    const distance = 60;
    const dx = sprite1.position.x - sprite2.position.x;
    const dy = sprite1.position.y - sprite2.position.y;
    const distanceBetween = Math.sqrt(dx * dx + dy * dy);
    return distanceBetween < distance;
  }

  const swapSpriteActions = (spriteId1, spriteId2) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId1) {
        const sprite2 = sprites.find(s => s.id === spriteId2);
        return { ...sprite, actions: sprite2 ? sprite2.actions : sprite.actions };
      }
      if (sprite.id === spriteId2) {
        const sprite1 = sprites.find(s => s.id === spriteId1);
        return { ...sprite, actions: sprite1 ? sprite1.actions : sprite.actions };
      }
      return sprite;
    }));
  };

  const handleStop = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
  }



  return (
    <div className="flex-none h-full overflow-hidden flex flex-col">
      
    {/* Control Panel */}
    <div className="bg-gray-100 p-3 border-b border-gray-300">
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
        >
          ▶ Play
        </button>
        <button
          onClick={handleStop}
          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold"
        >
          ⬛ Stop
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            resetAllSprites();
          }}
          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold"
        >
          ↻ Reset
        </button>
        <button
          onClick={addSprite}
          className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold"
        >
          + Add Sprite
        </button>
      </div>
    </div>

    <div className="bg-gray-50 p-2 border-b border-gray-300 max-h-32 overflow-y-auto">
        <div className="text-xs font-bold mb-1 text-gray-600">SPRITES ({sprites.length})</div>
        <div className="space-y-1">
          {sprites.map(sprite => (
            <div
              key={sprite.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                selectedSpriteId === sprite.id
                  ? 'bg-blue-200 border-2 border-blue-500'
                  : 'bg-white hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => setSelectedSpriteId(sprite.id)}
            >
              <span className="text-sm font-medium">{sprite.name}</span>
              {sprites.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSprite(sprite.id);
                  }}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {collisionState && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg shadow-2xl text-xl font-bold animate-bounce">
            💥 COLLISION! 💥
            <div className="text-sm mt-2 font-normal">{collisionState.message}</div>
            <div className="text-xs mt-1 font-normal">Actions Swapped!</div>
          </div>
        </div>
      )}

      <div className="flex-1 relative bg-white overflow-hidden">
        {sprites.map(sprite => (
          <div
            key={sprite.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '30%',
              transform: `translate(calc(-50% + ${sprite.position.x}px), calc(-50% + ${sprite.position.y}px)) rotate(${sprite.rotation}deg)`,
              transition: 'transform 0.5s ease',
            }}
          >
            <div className={`
              ${selectedSpriteId === sprite.id ? 'ring-4 ring-blue-500' : ''}
              ${collisionState && (collisionState.sprite1 === sprite.id || collisionState.sprite2 === sprite.id) 
                ? 'ring-8 ring-red-500 animate-pulse' 
                : ''
              }
              rounded-lg
            `}>
              <CatSprite />
            </div>

            {/* Speech/Think Bubble */}
            {speechBubbles[sprite.id] && (
              <div
                className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap ${
                  speechBubbles[sprite.id].type === 'say'
                    ? 'bg-white border-2 border-gray-300'
                    : 'bg-gray-100 border-2 border-gray-400'
                }`}
              >
                {speechBubbles[sprite.id].text}
                <div
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
                    speechBubbles[sprite.id].type === 'say'
                      ? 'border-t-gray-300'
                      : 'border-t-gray-400'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

