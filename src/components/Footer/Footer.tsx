import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './Footer.module.scss';

export const Footer = () => {
    const {t} = useTranslation();
    return (
        <div className={styles.footer}>
            <p>&copy; {t("footer.copyright")}</p>
        </div>
    );
};
