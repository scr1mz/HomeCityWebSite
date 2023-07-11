import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import { deleteObject, updateObjectCategory } from "../../services/api/listingApi";
import styles from './SelectCategoryDialog.module.scss';
import type { Listing } from '../../utils/types/listingTypes';
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

interface SelectCategoryDialogProps {
	variant: string;
	listing: Listing;
    onChange: (listing: Listing) => void;
	onRemove: (id: number) => void;
    onCancel: () => void;
}

export const SelectCategoryDialog: React.FC<SelectCategoryDialogProps> = ({ variant, listing, onChange, onRemove, onCancel }) => {
	const {t} = useTranslation();
    const [category, setCategory] = useState(listing.category);
    const [message, setMessage] = useState<any>({});

    const handleChange = async () => {
		setMessage({});
		if (category === "removed") {
			const res = await deleteObject(listing.id);
			if (!res) {
				setMessage({error: true, text: t("something_went_wrong")});
				return;
			}
			onRemove(listing.id);
		} else {
			const res = await updateObjectCategory(listing.id, category);
			if (!res) {
				setMessage({error: true, text: t("something_went_wrong")});
				return;
			}
			const newListing = {...listing};
			newListing.category = category;
			onChange(newListing);
		}
    };

	const categories = variant === "myListings"
		? ["draft", "checking", "archived", "removed"]
		: variant === "moderation"
			? ["approved", "rejected"]
			: [];

	return (
		<Dialog open>
            <DialogTitle>{t("category_dialog.title")}</DialogTitle>
			<DialogContent>
				<div className={styles.selectCategoryDialog}>
					<FormControl>
						<RadioGroup
							value={category}
							onChange={e => setCategory(e.target.value)}
						>
							{categories.map(item => (
								<FormControlLabel key={item} value={item} control={<Radio />} label={t(`category_list.${item}`)} />
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
