import React from 'react';
import type { Listing, User } from '../../utils/types/listingTypes';
import styles from './ListingActions.module.scss';
import { useTranslation } from "react-i18next";

interface ListingActionsProps {
    listing: Listing;
    user: User | null;
    agent: User | null;
}

const ListingActions: React.FC<ListingActionsProps> = ({ listing, user, agent }) => {
    const { t } = useTranslation();
    // Проверки на null перед обращением к свойствам объекта user и agent
    const ownerName = user ? user.full_name : 'Неизвестный пользователь';
    const ownerPhone = user ? user.phone : '-';
    const agentName = agent ? agent.full_name : 'Неизвестный агент';
    const agentPhone = agent ? agent.phone : '-';

    const formattedTitle = t(`listing_card.title_${listing.property_type}`, listing);

    return (
        <div className={styles.listingActions}>
            <h3>Продается {formattedTitle}</h3>
            <p>Цена: {listing.price.toLocaleString('ru-RU')} ₽</p>
            <p>Собственник: {ownerName}</p>
            <p>Телефон собственника: {ownerPhone}</p>
            {agent && (
                <>
                    <p>Агент: {agentName}</p>
                    <p>Телефон агента: {agentPhone}</p>
                </>
            )}
        </div>
    );
};

export default ListingActions;
