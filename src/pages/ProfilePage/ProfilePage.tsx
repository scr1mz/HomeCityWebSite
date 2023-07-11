import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.scss';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getProfile, updateProfile, deleteToken, refill, getUserPayments, getUserPurchases} from "../../services/api/listingApi";
import { useCookies } from 'react-cookie';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import useLocalStorageState from "use-local-storage-state";
import type { Payment, Purchase } from '../../utils/types/listingTypes';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { LoginDialog } from '../../components/LoginDialog';

export const ProfilePage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>({});
    const [message, setMessage] = useState<any>({});
    const [cookies, , removeCookie] = useCookies(["id", "token"]);
    const [, setInfo] = useLocalStorageState("info");
    const [sum, setSum] = useState(100);
    const [variant, setVariant] = useState("profile");
    const [payments, setPayments] = useState<Payment[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        const fetch = async () => {
            setMessage({});
            const profile = await getProfile();
            if (profile === null) {
                setMessage({error: true, text: t("something_went_wrong")});
                return;
            }
            setProfile(profile);
        };
        fetch();
    }, [t, cookies.token]);

    const handleUpdate = async () => {
        setMessage({});
        const info = await updateProfile(profile);
        if (!info) {
            setMessage({error: true, text: t("something_went_wrong")});
            return;
        }
		setInfo(info);
        setMessage({error: false, text: t("updated")});
    };

	const handleExit = async () => {
		await deleteToken();
		removeCookie("id", {path: "/"});
		removeCookie("token", {path: "/"});
        setInfo({});
		navigate("/");
	};

    const handleChange = (name: string, value: any) => {
        setMessage({});
        setProfile({...profile, [name]: value});
    };

    const handleUpdateBalance = async () => {
        setMessage({});
        const profile = await getProfile();
        if (profile === null) {
            setMessage({error: true, text: t("something_went_wrong")});
            return;
        }
        setProfile(profile);
        setMessage({error: false, text: t("updated")});
    };

    const handleRefill = async () => {
        setMessage({});
        const url = await refill(sum);
        if (url === null) {
            setMessage({error: true, text: t("something_went_wrong")});
            return;
        }
        window.location.href = url;
    };

    const handlePayments = async () => {
        setMessage({});
        const payments = await getUserPayments(cookies.id);
        if (payments === null) {
            setMessage({error: true, text: t("something_went_wrong")});
            return;
        }
        setPayments(payments);
        setVariant("payments");
    };

    const handlePurchases = async () => {
        setMessage({});
        const purchases = await getUserPurchases(cookies.id);
        if (purchases === null) {
            setMessage({error: true, text: t("something_went_wrong")});
            return;
        }
        setPurchases(purchases);
        setVariant("purchases");
    };

    return (
        <div className={styles.profilePage}>
            {cookies.id === undefined && <LoginDialog onClose={() => navigate("/")} />}
            {variant === "purchases" && (
                <>
                    <h1>{t("purchases")}</h1>
                    <div className={styles.purchases}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {purchases.map(purchase => (
                                        <TableRow key={purchase.id}>
                                            <TableCell>
                                                {purchase.date_time.toLocaleDateString() + " " + purchase.date_time.toLocaleTimeString()}
                                            </TableCell>
                                            <TableCell>
                                                {purchase.sum + " ₽"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={styles.controls}>
                        <Button variant="text" onClick={() => setVariant("profile")} sx={{width: "156px"}} >
                            {t("back")}
                        </Button>
                    </div>
                </>
            )}
            {variant === "payments" && (
                <>
                    <h1>{t("refills")}</h1>
                    <div className={styles.payments}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {payments.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                {payment.date_time.toLocaleDateString() + " " + payment.date_time.toLocaleTimeString()}
                                            </TableCell>
                                            <TableCell>
                                                {payment.sum + " ₽"}
                                            </TableCell>
                                            <TableCell>
                                                {payment.pending ? <HourglassBottomIcon color="warning" /> : <CheckCircleIcon color="success" />}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div className={styles.controls}>
                        <Button variant="text" onClick={() => setVariant("profile")} sx={{width: "156px"}} >
                            {t("back")}
                        </Button>
                    </div>
                </>
            )}
            {variant === "profile" && (
                <>
                    <h1>{t("profile.title")}</h1>
                    <TextField
                        label={t("full_name")}
                        size="small"
                        className={styles.field}
                        value={profile.full_name || ""}
                        onChange={e => handleChange("full_name", e.target.value)}
                    />
                    <TextField
                        label={t("phone")}
                        size="small"
                        className={styles.field}
                        value={profile.phone || ""}
                        onChange={e => handleChange("phone", e.target.value)}
                    />
                    <TextField
                        label={t("email")}
                        size="small"
                        className={styles.field}
                        value={profile.email || ""}
                        onChange={e => handleChange("email", e.target.value)}
                    />
                    <TextField
                        label={t("password")}
                        type="password"
                        size="small"
                        className={styles.field}
                        value={profile.password || ""}
                        onChange={e => handleChange("password", e.target.value)}
                    />
                    <TextField
                        disabled
                        label={t("balance")}
                        type="number"
                        size="small"
                        className={styles.field}
                        value={profile.balance || 0}
                        InputProps={{
                            endAdornment: (
                                <>
                                    <InputAdornment position="end">₽</InputAdornment>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handlePurchases}
                                        >
                                            <ChecklistIcon />
                                        </IconButton>
                                    </InputAdornment>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleUpdateBalance}
                                        >
                                            <CachedIcon />
                                        </IconButton>
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                    <TextField
                        label={t("sum")}
                        type="number"
                        size="small"
                        className={styles.field}
                        value={sum}
                        onChange={e => setSum(Number(e.target.value))}
                        InputProps={{
                            endAdornment: (
                                <>
                                    <InputAdornment position="end">₽</InputAdornment>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handlePayments}
                                        >
                                            <ChecklistIcon />
                                        </IconButton>
                                    </InputAdornment>
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleRefill}
                                        >
                                            <CreditCardIcon />
                                        </IconButton>
                                    </InputAdornment>
                                </>
                            )
                        }}
                    />
                    {"text" in message && message.text !== "" && (
                        <div className={message.error ? styles.error : styles.info}>
                            {message.text}
                        </div>
                    )}
                    <div className={styles.controls}>
                        <Button variant="contained" onClick={handleUpdate} sx={{width: "156px"}} >
                            {t("change")}
                        </Button>
                        <Button variant="contained" color="error" onClick={handleExit} sx={{width: "156px"}} >
                            {t("exit")}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
