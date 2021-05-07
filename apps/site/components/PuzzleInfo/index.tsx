import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {light} from 'react-syntax-highlighter/dist/cjs/prism'

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.module.scss';


const components = {
    code({inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter style={light} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
        ) : (
            <code className={className} {...props} />
        )
    },
}

export type PuzzleInfoProps = {
    title: string;
    author: any;
    readme: string;
    finished: boolean;
}

export const PuzzleInfo: FC<PuzzleInfoProps> = (props) => {
    return <div className={styles.info}>
        <div className={`${styles.banner} banner`}>
            <div style={{flexGrow: 1}}>
                "{props.title}" by {props.author}
            </div>
            <div>
                { props.finished && <FontAwesomeIcon className={styles.icon} icon={faCheckCircle} />}
            </div>
        </div>
        <ReactMarkdown
            className={styles.markdown}
            skipHtml children={props.readme}
            components={components as any}
        />
    </div>
}

