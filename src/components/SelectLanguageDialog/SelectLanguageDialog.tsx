import React from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";

import {i18n, availableLanguages} from "../../i18n";

interface SelectLanguageDialogProps {
    onClose: () => void;
}

export const SelectLanguageDialog: React.FC<SelectLanguageDialogProps> = ({ onClose }) => {
	return (
		<Dialog open onClose={onClose}>
			<List>
				{
					Object.entries(availableLanguages).map(([language, info]) => (
						<ListItemButton
							sx={{width: "200px"}}
							selected={i18n.language === language}
							onClick={() => {
								i18n.changeLanguage(language);
								onClose();
							}}
							key={language}
						>
							<ListItemText primary={info.name} />
						</ListItemButton>
					))
				}
			</List>
		</Dialog>
	);
};
