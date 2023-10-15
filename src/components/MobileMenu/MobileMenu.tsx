import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useCookies} from "react-cookie";
import useLocalStorageState from "use-local-storage-state";
import { useSpring, animated } from 'react-spring';
import { useMobileMenu } from '../MobileMenuProvider/MobileMenuProvider'
import './MobileMenu.scss'
import styles from '../Header/Header.module.scss'

interface MobileMenuProps {
    setSelectPropertyTypeDialogVisible: (visible: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ setSelectPropertyTypeDialogVisible }) => {
    const {t} = useTranslation();
    const [cookies] = useCookies(["id", "token"]);
    const [info] = useLocalStorageState<any>("info");
    const { isOpen, toggleMenu, updateBurgerIcon } = useMobileMenu()

    const closeMenu = (): void => {
            toggleMenu();
            updateBurgerIcon();
    }

    const menuAnimation = useSpring({
        from: { transform: 'translate3d(0, -100%, 0) scale(0.5)', opacity: 0 },
        to: {
            transform: isOpen ? 'translate3d(-7%, 0, 0) scale(1)' : 'translate3d(-50%, -100%, 0) scale(0.5)',
            opacity: isOpen ? 1 : 0,
        },
        config: { mass: 8, tension: 700, friction: 100 },
        duration: 350
    });

    return (
        <animated.div className="mobile-menu" style={menuAnimation}>
            <div className={'blur'}/>
            <nav className={'mobile-menu__content'}>
                <ul className="mobile-menu__list">
                    <li>
                        <Link to="/allListings" className={styles.navLink} onClick={() => closeMenu()}>
                            {t("header.buy")}
                        </Link>
                    </li>
                    <li>
                        <div className={styles.navLink}
                             onClick={() => {
                                 setSelectPropertyTypeDialogVisible(true);
                                 closeMenu();
                             }}>
                            {t("header.sell")}
                        </div>
                    </li>
                    {cookies.id && (
                        <Link to="/myListings" className={styles.navLink} onClick={() => closeMenu()}>
                            {t("header.my_listings")}
                        </Link>
                    )}
                    {info && info.role === "admin" && (
                        <Link to="/users" className={styles.navLink} onClick={() => closeMenu()}>
                            {t("header.users")}
                        </Link>
                    )}
                    {info && (info.role === "admin" || info.role === "moderator") && (
                        <Link to="/moderation" className={styles.navLink} onClick={() => closeMenu()}>
                            {t("header.moderation")}
                        </Link>
                    )}
                </ul>
            </nav>
        </animated.div>
    )
}
