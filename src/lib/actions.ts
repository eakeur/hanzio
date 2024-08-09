'use server'

import pinyin from "pinyin";

export type Character = {
  strokeOrderUrl: string
  character: string
  pinyin: string[]
}

export type CharacterGroup = {
  stringChracters: string[]
  characters: Character[]
  translations: string[]
}

export async function getCharcaterMap(str: string) : Promise<Character> {
  const char = str.split("").at(0) ?? ""

  return {
    character: char,
    pinyin: pinyin(char, {
      heteronym: true
    }).at(0) ?? [],
    strokeOrderUrl: ""
  } satisfies Character
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
        translations: []
      }) as CharacterGroup)
      .filter((t) => t.stringChracters.length > 0) ?? []


    const charGroups = await Promise.all(groups.map(async group => {
      group.characters = await Promise.all(group.stringChracters.map(c => getCharcaterMap(c)))
      group.translations = await getTranslations(group.stringChracters.join(""))
      return group
    }))

    return charGroups
      .map(group => {
        group.characters = group.characters.filter(g => g.character != "")
        return group
      })
      .filter(group => group.characters.length > 0)
}

async function getTranslations(str: string){
  const res = await fetch("http://localhost:7143/translate", {
    method: "POST",
    body: JSON.stringify({
      q: str,
      source: "zh",
      target: "en",
      format: "text",
      alternatives: 2,
      api_key: ""
    }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();

  return [(data.translaredText ?? ""), ...(data.alternatives ?? [])]
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