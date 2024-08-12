import HanziWriter from "hanzi-writer";
import { useRef, useEffect } from "react"

type StrokesBoardProps = {
    character: string
}

export function StrokesBoard({ character }: StrokesBoardProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && ref.current.childNodes.length > 0){
            ref.current.childNodes.forEach(i => i.remove())
        }
        const wr = HanziWriter.create(ref.current!, character, {
            showOutline: true,
            strokeColor: '#ffffff',
            outlineColor: "#2b0106",
            width: 250,
            height: 250
        })

        wr.setCharacter(character)
        wr.loopCharacterAnimation();
    }, [ref.current])

    return <div className="flex justify-center" key={character} ref={ref}></div>
}