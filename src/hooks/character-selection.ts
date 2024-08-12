import { CharacterGroup } from "@/lib/actions";
import { useEffect, useState } from "react"

export default function useCharacterSelection({characters}: { characters: CharacterGroup[]}) {

    const [ index, setIndex ] = useState({x: 0, y: 0})

    useEffect(() => {

        const handleKeyDown = (event: KeyboardEvent) => {
          if ((event.key != "ArrowRight" && event.key != "ArrowLeft") || characters.length == 0)
            return
    
          const op = {
            "ArrowRight": 1,
            "ArrowLeft": -1
          }

          setCharacterSelected(index.x, index.y + op[event.key])
          
        };
    
        // Add event listener
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };

      }, [characters]);

      function setCharacterSelected(x, y) {
        let maxX = characters.length;

        // Handle the case where 'y' is negative (move to previous phrase)
        while (y < 0) {
            x = (x - 1 + maxX) % maxX; // Move to the previous phrase and wrap around if necessary
            y += characters[x].characters.length; // Set 'y' to the last character in the previous phrase
        }

        let maxY = characters[x].characters.length;

        // Handle positive overflow (move to the next phrase)
        x = (x + Math.floor(y / maxY)) % maxX;

        // Recalculate 'maxY' because 'x' might have changed
        maxY = characters[x].characters.length;

        // Wrap 'y' around using modulus
        y = y % maxY;

    }

    return {
        phraseSelected: index.x,
        characterSelected: index.y,
        setCharacterSelected,
        isSelected: (x, y) => x == index.x && y == index.y,
        character: characters.at(index.x)?.characters.at(index.y)
    }
}