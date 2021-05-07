import styles from './styles.module.scss';


const Header = () => {
    return <div className={styles.header}>
        <div className={styles.logo}>
            <a href="/"><img alt="logo" src="/logo.svg" /></a>
        </div>
    </div>
}

export default Header
