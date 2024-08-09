import HanziWriter from "hanzi-writer";
import { useRef, useEffect, useState, useMemo } from "react"

type StrokesBoardProps = {
    character: string
}

export function StrokesBoard({ character }: StrokesBoardProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    return <div className="flex justify-center" key={Math.random()} ref={ref} id={'strokeboard' + character}></div>
}