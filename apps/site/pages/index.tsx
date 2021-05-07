import React from 'react';

import { GetStaticProps, InferGetStaticPropsType } from 'next'

import styles from './index.module.scss';


export const getStaticProps: GetStaticProps = async () => {
    return { props: { hideHeader: true }}
}

export const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    return <div className={styles.splash}>
        <img className={styles.logo} alt="logo" src="/logo.svg" />
        <div className={styles.byline}>
            Collection of auto-validated Typescript type challenges
        </div>
        <div className={styles.buttons}>
            <a href="/challenges/">
                <div className={styles.button}>
                View Challenges
                </div>
            </a>
            <a href="https://github.com/type-challenges/type-challenges">
                <div className={styles.button}>
                View On Github
                </div>
            </a>
        </div>
        <div className={styles.about}>
            <a href="/about/">
                What's a "type challenge"?
            </a>
        </div>
    </div>
}

export default Index;
