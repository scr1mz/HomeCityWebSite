import React from 'react';
import {useTranslation} from "react-i18next";
import styles from './HomePage.module.scss';
import backgrd1 from '/images/background1.jpg';

export const HomePage = () => {
    const {t} = useTranslation();
    return (
        <div className={styles.homePage}>
            <div className={styles.headBlock} style={{backgroundImage: `url(/images/background1.jpg)`}}>
                <h1>{t("home.greeting")}</h1>
                <p>{t("home.slogan")}</p>
                <img src="/images/logo2.png" alt="HomeCity Logo"/>
                <p className={styles.info}>{t("home.info")}</p>
            </div>
            <div className={styles.middleBlock}>
                
            </div>
        </div>
    );
};
