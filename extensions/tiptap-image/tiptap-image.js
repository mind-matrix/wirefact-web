import { Node, Plugin } from 'tiptap';
import { nodeInputRule } from 'tiptap-commands';
import TipTapImageComponent from './tiptap-image.component.vue';

const IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export class TipTapImage extends Node {
    get name() {
        return 'image'
    }

    get schema() {
        return {
            inline: true,
            attrs: {
                src: {},
                alt: {
                    default: null,
                },
                title: {
                    default: null,
                },
                width: {
                    default: 300,
                },
                height: {
                    default: 300
                },
                dataId: {
                    default: null
                },
                dataKey: {
                    default: null
                }
            },
            group: 'inline',
            content: 'inline*',
            draggable: false,
            parseDOM: [{
                tag: 'img[src]',
                getAttrs: dom => ({
                    src: dom.getAttribute('src'),
                    title: dom.getAttribute('title'),
                    alt: dom.getAttribute('alt'),
                    height: dom.getAttribute('height') || 300,
                    width: dom.getAttribute('width') || 300,
                    dataId: dom.getAttribute('data-id'),
                    dataKey: dom.getAttribute('data-key')
                }),
            }],
            toDOM: (node) => {
                return ['img', {
                    src: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${node.attrs.width} ${node.attrs.height}"/%3E`,
                    dataSrc: node.attrs.src,
                    style: `position: relative; margin: 0 auto; height: ${node.attrs.height}px; width: ${node.attrs.width}px;`,
                    alt: node.attrs.alt,
                    title: node.attrs.title,
                    dataId: node.attrs.dataId,
                    dataKey: node.attrs.dataKey
                }, 0];
            },
        }
    }
    commands({ type }) {
        return attrs => (state, dispatch) => {
            const { selection } = state;
            const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
        }
    }

    inputRules(context) {
        const { type } = context;
        return [
            nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
                const [, alt, src, title, height, width, dataId, dataKey] = match;
                console.log(alt, src, title, height, width, dataId, dataKey)
                return {
                    src,
                    alt,
                    title,
                    height,
                    width,
                    dataId,
                    dataKey
                }
            }),
        ];
    }

    get plugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        drop(view, event) {
                            // I don't want to allow this
                            return false;
                        }
                    }
                },
            }),
        ]
    }

    get view() {
        return TipTapImageComponent;
    }
}