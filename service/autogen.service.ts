import { BaseService } from "./base.service"
import { summarize } from "./summarize"
import nlp from "compromise"

export class AutoGenService extends BaseService {
    title(html: string) {
        return null
    }

    topics(text: string) {
        return Array.from(new Set(nlp(text).topics().json({ normal: true }).map((topic: { normal: string }) => topic.normal.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "")).filter((topic: string) => topic.trim().length)))
    }

    hashtags(text: string) {
        return Array.from(new Set(nlp(text.toLowerCase()).hashTags().json().map((tag: { text: string }) => tag.text).filter((tag: string) => tag.trim().length)))
    }

    excerpt(text: string, sentences: number = 5, keywords: number = 10) {
        // const text = convert(html)
        const summary = summarize(text, sentences, keywords)
        return summary
    }
}