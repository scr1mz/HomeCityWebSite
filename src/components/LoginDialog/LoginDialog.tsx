import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createUser, setToken, sendOneTimePassword } from "../../services/api/listingApi";
import { useCookies } from "react-cookie";
import useLocalStorageState from "use-local-storage-state";
import styles from './LoginDialog.module.scss';

interface LoginDialogProps {
	onEnter?: () => void;
    onClose?: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ onEnter, onClose }) => {
	const {t} = useTranslation();
    const [, setCookie] = useCookies(["id", "token"]);
    const [, setInfo] = useLocalStorageState("info");
    const [variant, setVariant] = useState("authorization");
    const [data, setData] = useState<any>({});
    const [message, setMessage] = useState<any>({});

    const handleEnter =async () => {
		setMessage({});
		const res = await setToken(data.email, data.password);
		if (res === null) {
			setMessage({error: true, text: t("something_went_wrong")});
			return;
		}
		setCookie("id", res.id, {path: "/", maxAge: 1e12});
		setCookie("token", res.token, {path: "/", maxAge: 1e12});
		setInfo(res.info);
		onEnter && onEnter();
    };

    const handleRegister = async () => {
		setMessage({});
		const res = await createUser(data.fullName, data.phone, data.email, data.password);
		if (res === null) {
			setMessage({error: true, text: t("something_went_wrong")});
			return;
		}
		setCookie("id", res.id, {path: "/", maxAge: 1e12});
		setCookie("token", res.token, {path: "/", maxAge: 1e12});
		setInfo(res.info);
		onEnter && onEnter();
    };

	const handleSendOneTimePassword = async () => {
		setMessage({});
		const res = await sendOneTimePassword(data.email);
		if (!res) {
			setMessage({error: true, text: t("something_went_wrong")});
			return;
		}
		setMessage({text: t("login_dialog.one_time_password_info")});
    };

    const handleChange = (name: string, value: any) => {
        setMessage({});
        setData({...data, [name]: value});
    };

	return (
		<Dialog open onClose={onClose}>
            <DialogTitle>{t("login_dialog." + variant)}</DialogTitle>
			<DialogContent>
				<div className={styles.loginDialog}>
					{variant === "authorization" && (
						<>
							<TextField
								label={t("email")}
								fullWidth
								size="small"
								value={data.email || ""}
								onChange={e => handleChange("email", e.target.value)}
								onKeyPress={e => {
									if (e.key === "Enter") {
										handleEnter();
									}
								}}
							/>
							<TextField
								label={t("password")}
								type="password"
								fullWidth
								size="small"
								value={data.password || ""}
								onChange={e => handleChange("password", e.target.value)}
								onKeyPress={e => {
									if (e.key === "Enter") {
										handleEnter();
									}
								}}
							/>
						</>
					)}
					{variant === "registration" && (
						<>
							<TextField
								label={t("full_name")}
								fullWidth
								size="small"
								value={data.fullName || ""}
								onChange={e => handleChange("fullName", e.target.value)}
							/>
							<TextField
								label={t("phone")}
								fullWidth
								size="small"
								value={data.phone || ""}
								onChange={e => handleChange("phone", e.target.value)}
							/>
							<TextField
								label={t("email")}
								fullWidth
								size="small"
								value={data.email || ""}
								onChange={e => handleChange("email", e.target.value)}
							/>
							<TextField
								label={t("password")}
								type="password"
								fullWidth
								size="small"
								value={data.password || ""}
								onChange={e => handleChange("password", e.target.value)}
							/>
						</>
					)}
					{variant === "one_time_password" && (
						<>
							<TextField
								label={t("email")}
								fullWidth
								size="small"
								value={data.email || ""}
								onChange={e => handleChange("email", e.target.value)}
							/>
						</>
					)}
					{"text" in message && message.text !== "" && (
						<div className={message.error ? styles.error : styles.info}>
							{message.text}
						</div>
					)}
					<div className={styles.controls}>
						{variant === "authorization" && (
							<>
								<div className={styles.horizontalControls}>
									<Button variant="contained" onClick={handleEnter} color="success" sx={{width: "200px"}}>
										{t("login_dialog.enter")}
									</Button>
									<Button
										variant="outlined"
										onClick={() => {
											setVariant("one_time_password");
											setMessage({});
										}}
										sx={{width: "240px"}}
									>
										{t("login_dialog.one_time_password")}
									</Button>
								</div>
								<div className={styles.horizontalControls}>
									<Button
										variant="contained"
										onClick={() => {
											setVariant("registration");
											setMessage({});
										}}
										sx={{width: "200px"}}
									>
										{t("login_dialog.register")}
									</Button>
									<Button variant="text" onClick={onClose} sx={{width: "240px"}}>
										{t("cancel")}
									</Button>
								</div>
							</>
						)}
						{variant === "registration" && (
							<div className={styles.horizontalControls}>
								<Button variant="contained" onClick={handleRegister}>
									{t("login_dialog.register")}
								</Button>
								<Button
									variant="text"
									onClick={() => {
										setVariant("authorization");
										setMessage({});
									}}
								>
									{t("back")}
								</Button>
							</div>
						)}
						{variant === "one_time_password" && (
							<div className={styles.horizontalControls}>
								<Button variant="contained" onClick={handleSendOneTimePassword}>
									{t("login_dialog.send_one_time_password")}
								</Button>
								<Button
									variant="text"
									onClick={() => {
										setVariant("authorization");
										setMessage({});
									}}
								>
									{t("back")}
								</Button>
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
