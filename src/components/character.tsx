import { useEffect, useRef } from "react";

type CharacterViewProps = ChineseCharacter & {
    onClick: () => void,
    selected?: boolean
}

export function Character({
    value: character,
    pinyin, 
    onClick,
    selected
  }: CharacterViewProps){
    
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (selected) {
        ref.current?.focus();
        ref.current?.scrollIntoView({ 
            behavior: 'smooth', block: 'center' 
        });
      }
    }, [selected])
    
    return (
      <div 
        ref={ref}
        autoFocus={selected}
        onClick={onClick}
        className={
            `p-3 border-2 border-transparent rounded-lg text-center 
            ${selected ? "border-white": ""}`}>
            <h2 className="block">{character}</h2>
            <div className="flex justify-center align-middle">
            {
                pinyin.map((p, i) => (
                    <span key={i} className="m-2">{p}</span>
                ))
            }
            </div>
      </div>
    )
  }