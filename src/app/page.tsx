'use client'

import { handleSubmit, CharacterGroup } from "@/lib/actions";
import { useEffect, useRef, useState } from "react";
import { CharacterView } from "./CharacterView";
import { listenToText } from "@/actions/translate";
import { SoundHighSolid } from "iconoir-react";
import { Character } from "@/components/character-container";



export default function Home() {

  const [characters, setCharacters] = useState<CharacterGroup[]>([])

  const [index, setIndex] = useState([0, 0])

  const learningTableRef = useRef<HTMLDivElement>(null)

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

        if (y == maxY) {
          x = x + 1
          y = 0

          console.log("y == maxY ---> x=, y=", x, y)
        }

        if (x == maxX) {
          x = 0
          y = 0
          console.log("x == maxX ---> x=, y=", 0, 0)
        }

        console.log('Right arrow key pressed', x, y);
        setIndex([x, y])
      }

      if (event.key === 'ArrowLeft') {
        y--

        if (y < 0) {
          x--

          if (x < 0) {
            x = characters.length - 1
          }

          y = characters[x].characters.length - 1
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

  function isSelected(x: number, y: number) {
    return index[0] == x && index[1] == y
  }

  const x = `你好`

  return (
    <main className="font-sans mt-8 px-10 pb-10">
      <h1 className="text-6xl">
        <span style={{ fontFamily: "cursive" }}>汉子</span>
        <span style={{ fontFamily: "serif" }}> Stroke Order</span>
      </h1>
      <form className="container py-14 px-32" action={(e) => {
        handleSubmit(e).then(s => {
          setIndex([0, 0])
          setCharacters(s)
          learningTableRef.current?.scrollIntoView({block: 'nearest'})
        })
      }}>
        <div className="container flex shadow-2xl">
          <textarea defaultValue={x} rows={3} className="w-3/4 block p-2.5 text-xl rounded-l-lg border border-gray-300" id="text" name="text" />
          <button className="bg-[#47020a] w-1/4 block p-2.5 text-xl font-bold rounded-r-lg border border-[#47020a]">SEARCH</button>
        </div>


      </form>
      {
        characters.length > 0 && (
          <div ref={learningTableRef} id="learning-table" className="grid grid-cols-2 gap-5 p-7">

            <div className="rounded-2xl bg-[#47020a] p-7">
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
                          char={char} onClick={() => setIndex([i, ii])} />
                      ))
                    }
                  </div>
                  <div>
                    (<p key={i} className={"mb-2 " + (i == 0 ? "text-sm" : "text-xs")}>{group.translations}</p>)

                  </div>
                  
                  <button onClick={async () => {
                    var res = await listenToText(group.stringChracters.join(""))
                    const audioContext = new AudioContext();
                    const pollyBufferSourceNode = audioContext.createBufferSource();
                    pollyBufferSourceNode.buffer = await audioContext.decodeAudioData(new Uint8Array(res).buffer);
                    pollyBufferSourceNode.connect(audioContext.destination);
                    pollyBufferSourceNode.start();
                  }}><SoundHighSolid name="sound-high-solid"/></button>
                </div>
              ))}
            </div>

            {
              characters[index[0]] && characters[index[0]].characters[index[1]] && (
                <div className="rounded-2xl bg-[#47020a] sticky top-1/4 h-screen">
                  <Character key={characters[index[0]].characters[index[1]].value} character={characters[index[0]].characters[index[1]]} />
                </div>
              )
            }

          </div>
        )
      }
    </main>
  );
}
