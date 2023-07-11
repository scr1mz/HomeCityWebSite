import React from 'react';
import { FIELDS_BY_PROPERTY_TYPE, ATTRS_BY_PROPERTY_NAME } from '../../pages/ListingEditorPage';
import type { Listing } from '../../utils/types/listingTypes';
import styles from './ListingDetails.module.scss';
import { useTranslation } from "react-i18next";


interface ListingDetailsProps {
    listing: Listing;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing }) => {
    const {t} = useTranslation();

    const fields = FIELDS_BY_PROPERTY_TYPE[listing.property_type];

    const formattedValue = (name: string) => {
        const value = (listing as any)[name];
        const attrs = ATTRS_BY_PROPERTY_NAME[name];
        if (attrs.type === "it") {
            if (value === (attrs.min || 0)) {
                return t("no");
            }
            if (value === attrs.max) {
                return `${value}+`;
            }
            return value;
        }
        if (attrs.type === "b") {
            return value ? t("yes") : t("no");
        }
        if (attrs.type === "tt") {
            return t(value);
        }
        return value;
    };

    const formattedTitle = t(`listing_card.title_${listing.property_type}`, listing);

    return (
        <div className={styles.listingDetails}>
            <h2>{formattedTitle}</h2>
            <p>{listing.description}</p>
            <ul>
                <li><span className="label">{t("address")}</span>: <span className="label">{listing.address}</span></li>
                {fields.filter((name: string) => ["floor", "total_floors"].indexOf(name) === -1 && (listing as any)[name] !== null).map(
                    (name: string) => {
                        return <li key={name}><span className="label">{t(name)}</span>: <span className="value">{formattedValue(name)}</span></li>
                    }
                )}
            </ul>
        </div>
    );
};

export default ListingDetails;