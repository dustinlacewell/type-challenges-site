import React, { FC, useRef } from 'react'

import { editor } from 'monaco-editor';

import Editor, {
    EditorProps,
    OnChange,
    OnMount,
} from '@monaco-editor/react'


const UTILS = `
declare module "@type-challenges/utils" {
export type Expect<T extends true> = T
export type ExpectTrue<T extends true> = T
export type ExpectFalse<T extends false> = T
export type IsTrue<T extends true> = T
export type IsFalse<T extends false> = T

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends (1 & T) ? true : false
export type NotAny<T> = true extends IsAny<T> ? false : true

export type Debug<T> = { [K in keyof T]: T[K] }
export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false
export type ExpectValidArgs<FUNC extends (...args: any[]) => any, ARGS extends any[]> = ARGS extends Parameters<FUNC>
  ? true
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
}
`

type FixedEditorProps = {
    id: string
    prefix: string
    suffix: string
    content: string
} & EditorProps

const FixedEditor: FC<FixedEditorProps> = ({ id, prefix, suffix, content, children, ...editorProps}) => {
    const defaultValue = `// your code here
${content ? content + "\n" : ''}
// test cases
${suffix || ''}`;

    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
    const lastValue = useRef("")

    const undo = () => editorRef.current.setValue(lastValue.current)
    const save = () => lastValue.current = editorRef.current.getValue()

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        lastValue.current = defaultValue;

        const savedValue = localStorage.getItem(`${id}.value`)
        if (savedValue) {
            editor.setValue(savedValue)
        }
        // compiler options
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2016,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
        });

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({})
        monaco.languages.typescript.typescriptDefaults.addExtraLib(UTILS);
    }

    const handleEditorChange: OnChange = (value, event) => {
        if (
            !event.isUndoing &&
      ((prefix && !value.startsWith(prefix)) ||
      (suffix && !value.endsWith(suffix)))
        ) {
            undo()
        } else {
            save()
            localStorage.setItem(`${id}.value`, lastValue.current)
        }
    };


    return     <Editor
        height="100vh"
        defaultValue={defaultValue}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        defaultLanguage="typescript"
        {...editorProps}
    />
}

export default FixedEditor;
