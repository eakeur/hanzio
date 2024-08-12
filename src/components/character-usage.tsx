import { getPrompt, SuggestedPhrases } from "@/actions/translate";
import { useState, useEffect } from "react";
import ListenButton from "./listen-button";

export default function CharacterUsage({character}: { character: string }){

    const [ phrases, setPhrases ] = useState<{
        phrase: string;
        translation: string;
    }[]>()
  
    useEffect(() => {
      getPrompt(character).then(setPhrases)
    }, [character])
    
    return (
        <div>
            <h2>Examples</h2>
            <div>
            {
                phrases && phrases.map((phrase, i) => (
                    <div key={phrase.phrase} className="ml-2 p-5 flex items-center justify-between">
                        <div className="mr-4">
                            <p className="text-2xl">{phrase.phrase}</p>
                            <p className="text-sm">{phrase.translation}</p>
                        </div>
                        <div>
                            <ListenButton text={phrase.phrase}/>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}