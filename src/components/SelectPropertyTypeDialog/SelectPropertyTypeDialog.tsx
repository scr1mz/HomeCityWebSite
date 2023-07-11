import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import styles from './SelectPropertyTypeDialog.module.scss';
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { PROPERTY_TYPES } from "../ToggleProperty";

interface SelectPropertyTypeDialogProps {
	propertyType: string;
    onChange: (propertyType: string) => void;
    onCancel: () => void;
}

export const SelectPropertyTypeDialog: React.FC<SelectPropertyTypeDialogProps> = ({ propertyType, onChange, onCancel }) => {
	const {t} = useTranslation();
    const [currentPropertyType, setCurrentPropertyType] = useState(propertyType);

	return (
		<Dialog open>
            <DialogTitle>{t("type")}</DialogTitle>
			<DialogContent>
				<div className={styles.selectPropertyTypeDialog}>
					<FormControl>
						<RadioGroup
							value={currentPropertyType}
							onChange={e => setCurrentPropertyType(e.target.value)}
						>
							{PROPERTY_TYPES.map(item => (
								<FormControlLabel key={item} value={item} control={<Radio />} label={t(item)} />
							))}
						</RadioGroup>
					</FormControl>
                    <DialogActions>
                        <Button variant="text" onClick={onCancel}>
                            {t("cancel")}
                        </Button>
                        <Button variant="contained" onClick={() => onChange(currentPropertyType)}>
                            {t("ok")}
                        </Button>
                    </DialogActions>
				</div>
			</DialogContent>
		</Dialog>
	);
};
