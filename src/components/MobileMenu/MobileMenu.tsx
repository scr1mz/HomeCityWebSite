import React from 'react'
import {Link} from "react-router-dom";
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

    const [isMenuVisible, setMenuVisible] = React.useState(false);
    const menuAnimation = useSpring({

        from: {
            height: '0%',
            opacity: 0,
        },
        to: {
            height: isOpen ? '100%' : '0%',
            opacity: isOpen? 1 : 0.7,
        },
        onRest: () => {
            if (!isOpen) {
                setMenuVisible(true);
            }
        },
        config: { mass: 2, tension: 600, friction: 100 },
        duration: 350
    });

    const menuNavAnimation = useSpring({
        from: {
            transform: 'translateX(-100%)',
            height: '0%',
            opacity: 0,
        },
        to: {
            transform: isOpen? 'translateX(0%) scale(1)' : 'translateX(-100%) scale(0.5)',
            height: isOpen ? '100%' : '0%',
            opacity: isOpen ? 1 : 0,
        },
        config: { mass: 7, tension: 600, friction: 100 },
        duration: 350
    });

    return (
        <animated.div className="mobile-menu" style={{ display: isMenuVisible ? 'flex' : 'none', ...menuAnimation}}>
            <div className={'blur'}/>
            <nav className={'mobile-menu__content'}>
                <ul className="mobile-menu__list">
                    <animated.li style={menuNavAnimation}>
                        <Link to="/allListings" className={styles.navLink} onClick={() => closeMenu()}>
                            {t("header.buy")}
                        </Link>
                    </animated.li>
                    <animated.li style={menuNavAnimation}>
                        <div className={styles.navLink}
                             onClick={() => {
                                 setSelectPropertyTypeDialogVisible(true);
                                 closeMenu();
                             }}>
                            {t("header.sell")}
                        </div>
                    </animated.li>
                    {cookies.id && (
                        <animated.li>
                            <Link to="/myListings" className={styles.navLink} onClick={() => closeMenu()}>
                                {t("header.my_listings")}
                            </Link>
                        </animated.li>
                    )}
                    {info && info.role === "admin" && (
                        <animated.li>
                            <Link to="/users" className={styles.navLink} onClick={() => closeMenu()}>
                                {t("header.users")}
                            </Link>
                        </animated.li>
                    )}
                    {info && (info.role === "admin" || info.role === "moderator") && (
                        <animated.li>
                            <Link to="/moderation" className={styles.navLink} onClick={() => closeMenu()}>
                                {t("header.moderation")}
                            </Link>
                        </animated.li>
                    )}
                </ul>
            </nav>
        </animated.div>
    )
}
