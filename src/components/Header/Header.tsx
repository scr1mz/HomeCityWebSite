import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Header.module.scss";
import IconButton from "@mui/material/IconButton";
import LanguageIcon from "@mui/icons-material/Language";
import {SelectLanguageDialog} from "../SelectLanguageDialog";
import {SelectLocationDialog} from "../SelectLocationDialog";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import Button from "@mui/material/Button";
import {useCookies} from "react-cookie";
import {LoginDialog} from "../LoginDialog";
import useLocalStorageState from "use-local-storage-state";
import type {Location} from '../../utils/types/listingTypes';
import { SelectPropertyTypeDialog } from "../SelectPropertyTypeDialog";
import { BurgerIcon } from '../BurgerIcon/BurgerIcon';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { useMobileMenu } from '../MobileMenuProvider/MobileMenuProvider'

export const Header = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [location, setLocation] = useLocalStorageState<Location>("location", {
        defaultValue: {
            name: "Москва",
            coords: [55.753833, 37.620795]
        }
    });
    const {
        isOpen,
        toggleMenu,
        updateBurgerIcon
    } = useMobileMenu()
    const [cookies] = useCookies(["id", "token"]);
    const [info] = useLocalStorageState<any>("info");
    const [selectLanguageDialogVisible, setSelectLanguageDialogVisible] = useState(false);
    const [selectLocationDialogVisible, setSelectLocationDialogVisible] = useState(false);
    const [loginDialogVisible, setLoginDialogVisible] = useState(false);
    const [selectPropertyTypeDialogVisible, setSelectPropertyTypeDialogVisible] = useState(false);
    const handleLoginDialogClose = () => setLoginDialogVisible(false);
    const appRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!isOpen) {
            return
        }
            window.addEventListener('scroll', toggleMenu)
            window.addEventListener('scroll', updateBurgerIcon)

            return () => {
                window.removeEventListener('scroll', toggleMenu)
                window.removeEventListener('scroll', updateBurgerIcon)
            }
    })

    return (
        <div className={styles.header}>
            <div className={styles.topHeader}>
                <BurgerIcon/>
                <MobileMenu setSelectPropertyTypeDialogVisible={setSelectPropertyTypeDialogVisible} />
                <div className={styles.location}>
                    <Button
                        variant="text"
                        startIcon={<LocationOnIcon/>}
                        sx={{textTransform: "none", color: "white"}}
                        onClick={() => setSelectLocationDialogVisible(true)}
                        disableRipple
                    >
                        {location.name}
                    </Button>
                    {selectLocationDialogVisible && (
                        <SelectLocationDialog
                            location={location}
                            onAccept={(location: Location) => {
                                setSelectLocationDialogVisible(false);
                                setLocation(location);
                            }}
                            onClose={() => setSelectLocationDialogVisible(false)}
                        />
                    )}
                </div>
                <Link to="/" className={styles.logo}>
                        <img src="/images/logo2.png" alt="HomeCity Logo"/>
                        <span>HomeCity</span>
                </Link>
                <div className={styles.right_side}>
                    <div className={styles.login}>
                        <Button
                            variant="text"
                            startIcon={<PersonIcon/>}
                            sx={{textTransform: "none", color: "white"}}
                            onClick={() => {
                                if (cookies.id) {
                                    navigate("/profile");
                                } else {
                                    setLoginDialogVisible(true);
                                }
                            }}
                            disableRipple
                        >
                            {info.full_name || t("login_dialog.authorization")}
                        </Button>
                        {loginDialogVisible && (
                            <LoginDialog
                                onEnter={handleLoginDialogClose}
                                onClose={handleLoginDialogClose}
                            />
                        )}
                    </div>
                    <div className={styles.language}>
                        <IconButton size="small" onClick={() => setSelectLanguageDialogVisible(true)} disableRipple>
                            <LanguageIcon htmlColor="white"/>
                        </IconButton>
                        {selectLanguageDialogVisible && (
                            <SelectLanguageDialog onClose={() => setSelectLanguageDialogVisible(false)}/>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.bottomHeader}>
                <div className={styles.nav}>
                    <ul className={styles.navList}>
                        <li>
                            <Link to="/allListings" className={styles.navLink}>
                                {t("header.buy")}
                            </Link>
                        </li>
                        <li>
                            <div className={styles.navLink} onClick={() => setSelectPropertyTypeDialogVisible(true)}>
                                {t("header.sell")}
                            </div>
                        </li>
                        {selectPropertyTypeDialogVisible && (
                            <SelectPropertyTypeDialog
                                propertyType={"apartment"}
                                onChange={(propertyType: string) => {
                                    setSelectPropertyTypeDialogVisible(false);
                                    navigate(`/createListing/${propertyType}`);
                                }}
                                onCancel={() => setSelectPropertyTypeDialogVisible(false)}
                            />
                        )}
                        {cookies.id && (
                            <Link to="/myListings" className={styles.navLink}>
                                {t("header.my_listings")}
                            </Link>
                        )}
                        {info && info.role === "admin" && (
                            <Link to="/users" className={styles.navLink}>
                                {t("header.users")}
                            </Link>
                        )}
                        {info && (info.role === "admin" || info.role === "moderator") && (
                            <Link to="/moderation" className={styles.navLink}>
                                {t("header.moderation")}
                            </Link>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};
