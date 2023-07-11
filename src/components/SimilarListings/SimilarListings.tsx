import React from 'react';
import type { Listing } from '../../utils/types/listingTypes';
import { ListingCard } from '../ListingCard';
import styles from './SimilarListings.module.scss';

interface SimilarListingsProps {
    // Подразумевается, что вы передадите массив похожих объявлений через пропсы
    similarListings: Listing[];
}

export const SimilarListings: React.FC<SimilarListingsProps> = ({ similarListings }) => {
    // Здесь вы можете добавить логику для получения и отображения похожих объявлений

    return (
        <div className={styles.similarListings}>
            <h3>Похожие объявления</h3>
            <div className={styles.listingsContainer}>
                {similarListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} variant="listings" />
                ))}
            </div>
        </div>
    );
};

export default SimilarListings;