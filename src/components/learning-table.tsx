import useCharacterSelection from "@/hooks/character-selection";
import { CharacterGroup } from "@/lib/actions";
import { useRef } from "react";
import { Character } from "./character-container";
import ListenButton from "./listen-button";

export default function LearningTable({ characters }: { characters: CharacterGroup[] }) {

    const selection = useCharacterSelection(characters)

    const ref = useRef<HTMLDivElement>(null)

    return (
        <div ref={ref} id="learning-table" className="grid grid-cols-2 gap-5 p-7">
            <div className="rounded-2xl bg-[#47020a] p-7">
                {characters.map((group, i) => (
                    <div key={i} className="mb-5">
                        <div className="flex justify-end">
                            <ListenButton text={group.stringChracters} />
                        </div>
                        <div>
                            <div className="flex flex-wrap">
                                {
                                    group.characters.map((char, j) => (
                                        <div
                                            className={`p-3 border-2 border-transparent rounded-lg text-center 
                                            ${selection.isSelected(i, j) ? "border-white" : ""}`}
                                            ref={ref}
                                            autoFocus={selection.isSelected(i, j)}
                                            onClick={() => selection.characterSelected(i, j)}>
                                            <h2 className="block">{char.value}</h2>
                                            <span className="block">{char.pinyin.at(0) ?? ''}</span>
                                        </div>
                                    ))
                                }
                            </div>
                            <div>
                                <p key={i} className="mb-2 text-sm">
                                    {group.translations}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {
                selection.character && (
                    <div className="rounded-2xl bg-[#47020a] sticky top-1/4 h-screen">
                        <Character key={selection.character} character={selection.character} />
                    </div>
                )
            }

        </div>
    )
}