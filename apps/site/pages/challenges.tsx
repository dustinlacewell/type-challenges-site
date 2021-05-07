import React, { useState } from 'react';

import _ from 'lodash'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

import { PuzzleInfo } from '../components/PuzzleInfo';
import { getQuestions } from '../utils'

import styles from './challenges.module.scss';


export const getStaticProps: GetStaticProps = async () => {
    const questions = await getQuestions()
    return { props: { questions }}
}

export const Challenges = ({ questions }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [currentChallenge, setChallenge] = useState('warm');
    const grouped = _.groupBy(questions, 'challenge')
    const keys = ['warm', 'easy', 'medium', 'hard', 'extreme'];

    const buttons = keys.map(k => {
        let className = styles.button;
        if (currentChallenge === k) {
            className = `${className} ${styles.selected}`;
        }
        return <div className={className} onClick={() => setChallenge(k)}>{k}</div>
    }
    )

    const links = grouped[currentChallenge].map(q =>
        <div className={styles.link}>
            <a href={`/${q.dir}`}>
                <PuzzleInfo {...{ title: q.info.title, description: "", author: q.info.author.name, readme: q.prefix, finished: false }} />
            </a>
        </div>
    )

    return <div className={styles.index}>
        <div className={styles.buttons}>{buttons}</div>
        <div>{links}</div>
    </div>
}

export default Challenges;
