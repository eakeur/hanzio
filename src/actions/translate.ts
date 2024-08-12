'use server'

import { bedrock, polly, translateClient } from "@/services/aws"
import { withServerMemo } from "./memo"

export async function translateText(text: string) {
    return withServerMemo<string>("translateText", text, () => {
        return translateClient.translateText({
            Text: text,
            SourceLanguageCode: 'zh',
            TargetLanguageCode: 'pt'
        })
        .promise().then(t => {
            return t.TranslatedText
        })
    })
}

export async function listenToText(text: string) {
    return withServerMemo<Uint8Array>("listenToText", text, () => {
        return polly.synthesizeSpeech({
            Text: text,
            OutputFormat: "mp3",
            VoiceId: "Zhiyu"
        }).promise().then(p => p.AudioStream as Uint8Array)
    })
}

export type SuggestedPhrases = {
    a1: {
        phrase: string;
        translation: string;
    };
    a2: {
        phrase: string;
        translation: string;
    };
    b1: {
        phrase: string;
        translation: string;
    };
    b2: {
        phrase: string;
        translation: string;
    };
}

export async function getPrompt(text: string) {
    return withServerMemo("getPrompt", text, () => {
        const prompt = `
        Você é um assistente virtual de aprendizado de mandarim. Você recebe um caractere em mandarim e retorna frases contendo esse caracter e um formato JSON especificado nessas instruções.
        Quero que você gere frases em chinês com diferentes níveis de dificuldade (A1, A2, B1, B2), 
        baseadas em um caractere específico fornecido pelo usuário.
        Para cada frase gerada, você deve fornecer também uma tradução para o português.
        As frases devem variar em complexidade de acordo com o nível CEFR (Common European Framework of Reference for Languages).
        As frases devem ser breves contendo somente uma sentença com no máximo 8 caracteres. 
        As frases devem ter sujeito. Use vocabulários do dia a dia, como
        ir para a escola, trabalho, conversar com familiares ou amigos, ir a eventos, comidas e sentimentos.
        Você deve responder somente a estrutura de payload informada abaixo
        
        Estrutura do output:
        {
            "<level>": {
                "phrase": "<frase_em_chinês>",
                "translation": "<tradução_para_português>"
            }
        }
        
        Input do usuário: ${text}
        Níveis requeridos: A1, A2, B1, B2.

        Línguas envolvidas: Chinês (Hanzi simplificado) e Português.
        
        Exemplo de output:
        {
            "a1": {
                "phrase": "<frase_em_chinês>",
                "translation": "<tradução_para_português>"
            },
            "a2": {
                "phrase": "<frase_em_chinês>",
                "translation": "<tradução_para_português>"
            },
            "b1": {
                "phrase": "<frase_em_chinês>",
                "translation": "<tradução_para_português>"
            },
            "b2": {
                "phrase": "<frase_em_chinês>",
                "translation": "<tradução_para_português>"
            }
        }

        Valide se o JSON é valido e retorne somente ele
        `
            return bedrock.invokeModel({
                modelId: "anthropic.claude-3-haiku-20240307-v1:0",
                contentType: "application/json",
                body: JSON.stringify({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "messages": [{
                        "role": "user",
                        "content": [{
                            "type": "text",
                            "text": prompt
                        }]
                    }]
                }),
                
            }).promise()
            .then(r => r.body.toString())
            .then(JSON.parse)
            .then(d => d.content)
            .then(d => Array.from(d ?? []).at(0) as any)
            .then(d => d.text as string)
            .then(d => {
                try {
                    return JSON.parse(d)
                } catch (error) {
                    console.log("error parsing AI response", error, d)

                    const json = (d as string)
                        .substring(d.indexOf("{"), d.lastIndexOf("}") + 1)

                    console.log("tried to recapture", json)
                    return JSON.parse(json)
                }
            })
            .then(d => d as SuggestedPhrases)
            .then(d => [d.a1, d.a2, d.b1, d.b2]
                .filter(s => s.phrase
                    .includes(text)) as {
                phrase: string;
                translation: string;
            }[])
    })
}

