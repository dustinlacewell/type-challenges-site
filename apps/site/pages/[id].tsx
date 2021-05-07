import React, { useEffect, useState } from 'react';

import {
    GetStaticPaths,
    GetStaticProps,
    InferGetStaticPropsType,
} from 'next'

import { OnValidate } from '@monaco-editor/react';

import FixedEditor from '../components/FixedEditor';
import { PuzzleInfo } from '../components/PuzzleInfo';
import { getQuestionDirectories, parseQuestion } from '../utils'


const IGNORED_ERRORS = [
    "6196",
]

export const getStaticPaths: GetStaticPaths = async () => {
    const dirs = await getQuestionDirectories()
    const paths = dirs.map(id => ({ params: { id }}))
    return {
        paths,
        fallback: false,
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const question = await parseQuestion(context.params.id as string)
    return { props: question }
}

export default function Question({ dir, id, challenge, info, prefix, suffix, content }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [finished, setFinished] = useState(typeof window !== 'undefined' ? localStorage.getItem(`${id}.finished`) : 'false')
    const [mounted, setMounted] = useState(false)

    const onValidate: OnValidate = (markers) => {
        const filteredMarkers =
            markers.filter(m => !IGNORED_ERRORS.includes(m.code as string))
        const finished = `${filteredMarkers.length === 0}`;
        localStorage.setItem(`${id}.finished`, finished)
        setFinished(finished)
    }

    useEffect(() => {
        setMounted(true)
    })

    return mounted && <div className={'challenge'}>
        <PuzzleInfo {...{ title: info.title, author: info.author.name, readme: prefix, finished: finished === "true" }} />
        <FixedEditor
            height="90vh"
            defaultLanguage="typescript"
            onValidate={onValidate}
            id={id}
            prefix=""
            suffix={suffix.trim()}
            content={content.trim()}
        />
    </div>
}
