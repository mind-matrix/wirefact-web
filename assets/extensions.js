import {
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Code,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    HardBreak,
    HorizontalRule,
    History,
} from "tiptap-vuetify";
import { TrailingNode } from "tiptap-extensions";
import { TipTapImage } from "~/extensions";

export const EXTENSIONS = [
    History,
    Blockquote,
    Link,
    Underline,
    Strike,
    Italic,
    ListItem,
    BulletList,
    OrderedList, [
        Heading,
        {
            options: {
                levels: [1, 2, 3],
            },
        },
    ],
    Bold,
    Code,
    HorizontalRule,
    Paragraph,
    HardBreak,
]

export const NATIVE_EXTENSIONS = [
    new TipTapImage(),
    new TrailingNode({
        node: "paragraph",
        notAfter: ["paragraph"],
    }),
]