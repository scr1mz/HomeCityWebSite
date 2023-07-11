import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import Autocomplete from "@mui/material/Autocomplete";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { debounce } from '@mui/material/utils';
import { getLocations } from "../../services/api/listingApi";
import styles from './SelectLocationDialog.module.scss';
import type { Location } from '../../utils/types/listingTypes';

interface SelectLocationDialogProps {
	location: Location;
	onAccept: (location: Location) => void;
    onClose: () => void;
}

const fetch = async (name: string, callback: (locations: Location[]) => void) => {callback(await getLocations(name))};
const fetchWithDelay = debounce(fetch, 500);

export const SelectLocationDialog: React.FC<SelectLocationDialogProps> = ({ location, onAccept, onClose }) => {
	const {t} = useTranslation();
	const [name, setName] = useState(location.name);
    const [currentLocation, setCurrentLocation] = useState(location);
    const [options, setOptions] = useState<Location[]>([]);

    useEffect(() => {
        fetchWithDelay(name, setOptions);
    }, [name]);

	return (
		<Dialog open onClose={onClose}>
            <DialogTitle>{t("location_dialog.title")}</DialogTitle>
			<DialogContent>
				<div className={styles.selectLocationDialog}>
					<Autocomplete
						noOptionsText={t("not_found")}
						options={options}
						getOptionLabel={option => option.name}
						value={{name, coords: []}}
						size="small"
						sx={{width: "320px"}}
						onInputChange={(event, text) => setName(text)}
						onChange={(event, option) => setCurrentLocation(option || currentLocation)}
						renderInput={params => (
							<TextField
								{...params}
								variant="outlined"
							/>
						)}
					/>
					<DialogActions>
						<Button variant="text" onClick={onClose}>
							{t("cancel")}
						</Button>
						<Button variant="contained" onClick={() => onAccept(currentLocation)}>
							{t("apply")}
						</Button>
					</DialogActions>
				</div>
			</DialogContent>
		</Dialog>
	);
};
