import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { TunedCarousel } from '../TunedCarousel';
import type { Listing } from '../../utils/types/listingTypes';
import styles from './ListingCard.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import { SelectCategoryDialog } from "../SelectCategoryDialog";

interface ListingCardProps {
    listing: Listing;
    variant: string;
    onClick?:  (id: number) => void;
    onChange?: (listing: Listing) => void;
    onRemove?: (id: number) => void;
    onEdit?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, variant, onClick, onChange, onRemove, onEdit }) => {
    const {t} = useTranslation();
    const title = t(`listing_card.title_${listing.property_type}`, listing);

    const [imageIndex, setImageIndex] = useState(0);
    const [selectCategoryDialogVisible, setSelectCategoryDialogVisible] = useState(false);

    const theme = useTheme();
    const colors: any = {
		draft: [theme.palette.primary.main, theme.palette.primary.dark],
		checking: [theme.palette.warning.main, theme.palette.warning.dark],
		approved: [theme.palette.success.main, theme.palette.success.dark],
		rejected: [theme.palette.error.main, theme.palette.error.dark],
		archived: ["#64748B", "#465364"]
    };
    const [c1, c2] = colors[listing.category] || [theme.palette.primary.main, theme.palette.primary.dark];
    const categoryStyle = {
        width: "156px",
        backgroundColor: c1,
        "&:hover": {
            backgroundColor: c2
        }
	};

    return (
        <div
            className={styles.listingCard}
        >
            <TunedCarousel
                title={title}
                images={listing.images}
                onClick={() => onClick && onClick(listing.id)}
                imageIndex={imageIndex}
                setImageIndex={setImageIndex}
            />
            <div className={styles.listingInfo} onClick={() => onClick && onClick(listing.id)}>
                <h3>{title}</h3>
                <div className={styles.cardDescription}>
                    <p>{listing.description}</p>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.statusContainer}>
                    {(variant === "myListings" || variant === "moderation") && (
                        <Button
                            sx={categoryStyle}
                            variant="contained"
                            onClick={e => {
                                e.stopPropagation();
                                setSelectCategoryDialogVisible(true);
                            }}
                        >
                            {t(`category_list.${listing.category}`)}
                        </Button>
                    )}
                    {variant === "myListings" && (
                        <Button
                            variant="contained"
                            onClick={e => {
                                e.stopPropagation();
                                onEdit && onEdit(listing);
                            }}
                        >
                            {t("change")}
                        </Button>
                    )}
                        </div>
                    <div className={styles.priceContainer}>
                        <p className={styles.price}>{listing.price.toLocaleString()} ₽</p>
                    </div>
                </div>
            </div>
            {selectCategoryDialogVisible && (
                <SelectCategoryDialog
                    variant={variant}
                    listing={listing}
                    onChange={listing => {
                        setSelectCategoryDialogVisible(false);
                        onChange && onChange(listing);
                    }}
                    onRemove={id => {
                        setSelectCategoryDialogVisible(false);
                        onRemove && onRemove(id);
                    }}
                    onCancel={() => setSelectCategoryDialogVisible(false)}
                />
            )}
        </div>
    );
};
