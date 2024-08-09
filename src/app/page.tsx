'use client'

import { handleSubmit, Character, toStrokeOrder, CharacterGroup } from "@/lib/actions";
import HanziWriter from "hanzi-writer";
import { useEffect, useState } from "react";
import { CharacterView } from "./CharacterView";



export default function Home() {

  const [ characters, setCharacters] = useState<CharacterGroup[]>([])

  const [ index, setIndex ] = useState([0, 0])

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key != "ArrowRight" && event.key != "ArrowLeft") || characters.length == 0)
        return

      let x = index[0]
      let y = index[1]
      let maxX = characters.length
      let maxY = characters[x].characters.length

      if (event.key === 'ArrowRight') {
        y++
        console.log("y++", y)

        if (y == maxY){
          x = x+1
          y = 0

          console.log("y == maxY ---> x=, y=", x, y)
        }

        if (x == maxX){
          x = 0
          y = 0
          console.log("x == maxX ---> x=, y=", 0, 0)
        }

        console.log('Right arrow key pressed', x, y);
        setIndex([x, y])
      }
      
      if (event.key === 'ArrowLeft') {
        y--
        
        if (y < 0){
          x--

          if (x < 0){
            x = characters.length -1
          }

          y = characters[x].characters.length -1
        }

        console.log('Right arrow key pressed', x, y);
        setIndex([x, y])
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [characters, index]);

  function isSelected(x: number, y: number){
    return index[0] == x && index[1] == y
  }

  const x = `你好
我想你
我喜欢你
我到你家的时候你在做什么`

  return (
    <main className="font-sans mt-8 px-10 pb-10">
      <h1 className="text-6xl">汉子 Stroke Order</h1>
      <form className="container p-16" action={(e) => {
        handleSubmit(e).then(s => {
          setIndex([0, 0])
          setCharacters(s)
        })
      }}>
          <div className="container flex shadow-2xl">
            <textarea defaultValue={x} rows={2} className="w-3/4 block p-2.5 text-xl rounded-l-lg border border-gray-300" id="text" name="text"/>
            <button className="w-1/4 block p-2.5 text-xl font-bold rounded-r-lg border border-gray-300">SEARCH</button>
          </div>
          
          
      </form>
      {
        characters.length > 0 && (
          <div className="grid grid-cols-2 gap-5 rounded-2xl bg-[#47020a] p-7 shadow-2xl">
        
        <div>
          {characters.map((group, i) => (
            <div key={i} className="mb-5">
              <div className="flex flex-wrap">
                {
                  group.characters.map((char, ii) => (
                    <CharacterView
                    key={ii}
                    x={i}
                    y={ii}
                    selected={isSelected(i, ii)}
                    char={char} onClick={() => setIndex([i, ii])}/>
                  )) 
                }
              </div>
              <div>
                {
                  group.translations
                  .map((tr, i) => (<p key={i} className={"mb-2 " + (i == 0 ? "text-sm" : "text-xs")}>{tr}</p>))
                }
                
              </div>
            </div>
          ))}
        </div>

        {
          characters[index[0]] && characters[index[0]].characters[index[1]] && (
            <div>
              <CharacterView x={index[0]} y={index[1]} char={characters[index[0]].characters[index[1]]} image={true} show={true} onClick={() => null}/>
            </div>
          )
        }
        
      </div>
        )
      }
    </main>
  );
}
