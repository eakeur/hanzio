import { SuggestedPhrases, translateText, getPrompt, listenToText } from "@/actions/translate"
import { useState, useEffect } from "react"
import { StrokesBoard } from "./strokes-board"
import CharacterUsage from "./character-usage"
import ListenButton from "./listen-button"

export function Character({character: {value: character, pinyin}}: {
  character: ChineseCharacter
}){
  
      return (
        <div key={character} className="p-7">
          <div className="flex justify-end">
            <ListenButton text={character}/>
          </div>
          <div className="">
            <StrokesBoard character={character}></StrokesBoard>
            <div>
              <div className="flex justify-center align-middle">
                <h2 className="text-center text-2xl">{character}</h2>
              </div>
              <div className="flex justify-center align-middle">
                {pinyin.map((p, i) => (<span key={i} className="m-2">{p}</span>))}
              </div>
              <CharacterUsage character={character}/>
            </div>    
          </div>  
        </div>
      )
    }