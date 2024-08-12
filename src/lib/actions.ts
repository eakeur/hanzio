'use server'

import { translateText } from "@/actions/translate";
import pinyin from "pinyin";
import { v4 as uuidv4 } from 'uuid';


export type CharacterGroup = {
  stringChracters: string[]
  characters: ChineseCharacter[]
  translations: string
}

export async function getCharcaterMap(str: string) : Promise<ChineseCharacter> {
  const char = str.split("").at(0) ?? ""

  return {
    id: uuidv4(),
    value: char,
    pinyin: pinyin(char, {
      heteronym: true
    }).at(0) ?? [],
  } satisfies ChineseCharacter
}

export async function handleSubmit(formData: FormData) {
    const groups = formData
      .get("text")
      ?.toString()
      .replaceAll("\t", "")
      .replaceAll("\r", "\n")
      .replaceAll(" ", "")
      .split("\n")
      .map(s => ({
        stringChracters: s.trim().split("").filter((t) => t != ""),
        characters: [],
        translations: ""
      }) as CharacterGroup)
      .filter((t) => t.stringChracters.length > 0) ?? []


    const charGroups = await Promise.all(groups.map(async group => {
      group.characters = await Promise.all(group.stringChracters.map(c => getCharcaterMap(c)))
      group.translations = await getTranslations(group.stringChracters.join(""))
      return group
    }))

    return charGroups
      .map(group => {
        group.characters = group.characters.filter(g => g.value != "")
        return group
      })
      .filter(group => group.characters.length > 0)
}

async function getTranslations(str: string){
  return translateText(str).then(r => r)
}

const memo: {[key: string]: string} = {}
export async function toStrokeOrder(text = ""){
  const m = memo[text]
  if (m) return m
  
  const d = await fetchStrokeOrder(text).then(r => getSrcAttribute(r) ?? "")
  memo[text] = d

  return d
}
  

function fetchStrokeOrder(hanzi: string) {
    // console.log(`fetching stroke order for hanzi: ${hanzi}`)
    return fetch(`http://www.strokeorder.info/mandarin.php?q=${hanzi}`, { mode: "no-cors" }).then(res => res.text())
  }
  
  function getSrcAttribute(html: any) {
    if (!html)
        return
  
    var tag = new String(html)
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.startsWith(`<img src="http://bishun.strokeorder.info/characters`))
        .pop()
  
    if (tag === undefined)
        return
  
    tag = tag.split(" ")[1]
    return tag.substring(5, tag.length - 1)
  }