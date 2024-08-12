import { useRef, useEffect, useMemo } from "react"
import { StrokesBoard } from "./StrokesBoard"
type CharacterViewProps = {
    char: ChineseCharacter, 
    image?: boolean, 
    onClick: () => void,
    show?: boolean, 
    selected?: boolean,
    x: number
    y: number
}

export function CharacterView({
    char, 
    onClick, 
    show, image, 
    selected
  }: CharacterViewProps){
    
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (selected) {
        ref.current?.focus();
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, [selected])
    
    return (
      <div 
        className={`
            p-3 border-2 border-transparent 
            rounded-lg text-center 
            ${selected ? "border-white": ""}`}
        ref={ref}
        autoFocus={selected}
        onClick={onClick}>
        {image && <StrokesBoard character={char.value}></StrokesBoard>}
        <h2 className="block">{char.value}</h2>
        {show 
          ? <div>
            {char.pinyin.map((p, i) => (<span key={i} className="m-2">{p}</span>))}
          </div>
          : <span className="block">{char.pinyin.at(0) ?? ''} </span>
        }      
      </div>
    )
  }