import { listenToText } from "@/actions/translate";
import { SoundHighSolid } from "iconoir-react";

export default function ListenButton({text}: {text: string}){

    function onClick(){
        listenToText(text)
            .then(res => {
                const audioContext = new AudioContext();
                const pollyBufferSourceNode = audioContext
                    .createBufferSource();
                return audioContext
                    .decodeAudioData(new Uint8Array(res).buffer)
                    .then(b => {
                        pollyBufferSourceNode.buffer = b;
                        pollyBufferSourceNode
                            .connect(audioContext.destination);
                        pollyBufferSourceNode.start()
                    });
            });
    }
    return (
        <button onClick={onClick}><SoundHighSolid name="sound-high-solid"/></button>
    )
}