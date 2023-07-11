import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { updateUserRole } from "../../services/api/listingApi";
import styles from './SelectRoleDialog.module.scss';
import type { User } from '../../utils/types/listingTypes';
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

interface SelectRoleDialogProps {
	user: User;
    onChange: (user: User) => void;
    onCancel: () => void;
}

export const SelectRoleDialog: React.FC<SelectRoleDialogProps> = ({ user, onChange, onCancel }) => {
	const {t} = useTranslation();
    const [role, setRole] = useState(user.role);
    const [message, setMessage] = useState<any>({});

    const handleChange =async () => {
		setMessage({});
		const res = await updateUserRole(user.id, role);
		if (!res) {
			setMessage({error: true, text: t("something_went_wrong")});
			return;
		}
		const newUser = {...user};
		newUser.role = role;
		onChange(newUser);
    };

	const roles = ['admin', 'moderator', 'user', 'agent'];

	return (
		<Dialog open>
            <DialogTitle>{t("role_dialog.title")}</DialogTitle>
			<DialogContent>
				<div className={styles.selectRoleDialog}>
					<FormControl>
						<RadioGroup
							value={role}
							onChange={e => setRole(e.target.value)}
						>
							{roles.map(item => (
								<FormControlLabel key={item} value={item} control={<Radio />} label={t(`role_list.${item}`)} />
							))}
						</RadioGroup>
					</FormControl>
					{"text" in message && message.text !== "" && (
						<div className={message.error ? styles.error : styles.info}>
							{message.text}
						</div>
					)}
                    <DialogActions>
                        <Button variant="text" onClick={onCancel}>
                            {t("cancel")}
                        </Button>
                        <Button variant="contained" onClick={handleChange}>
                            {t("change")}
                        </Button>
                    </DialogActions>
				</div>
			</DialogContent>
		</Dialog>
	);
};
