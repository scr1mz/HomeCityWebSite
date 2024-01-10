import React from 'react';
import {useTranslation} from "react-i18next";
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

export const HomePage = () => {
    const {t} = useTranslation();
    return (
        <div className={styles.homePage}>
            <section className={styles.headBlock} style={{backgroundImage: `url(/images/background1.jpg)`}}>
                <h1>{t("home.greeting")}</h1>
                <p>{t("home.slogan")}</p>
                <div className={styles.moveToListingsButton}>
                    <Link to="/allListings">
                        {t("home.toListings")}
                    </Link>
                </div>
                <img src="/images/logo2.png" alt="HomeCity Logo"/>
                <p className={styles.info}>{t("home.info")}</p>
            </section>
            <section className={styles.middleBlock}>

            </section>
        </div>
    );
};
