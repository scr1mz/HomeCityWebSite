import React, { useState } from 'react';
import type { Listing } from '../../utils/types/listingTypes';
import styles from './ListingSlider.module.scss';

interface ListingSliderProps {
    listing: Listing;
}

const ListingSlider: React.FC<ListingSliderProps> = ({ listing }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = listing?.images;
    const totalImages = images?.length || 0;

    if (!images || totalImages === 0) {
        return null;
    }

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    return (
        <div className={styles.listingSlider}>
            <img src={images[currentIndex].image_url} alt="Listing" />
            <div className={styles.imageCounter}>
                {currentIndex + 1}/{totalImages}
            </div>
            <button className={styles.prevButton} onClick={handlePrevClick}>
                &lt;
            </button>
            <button className={styles.nextButton} onClick={handleNextClick}>
                &gt;
            </button>
        </div>
    );
};

export default ListingSlider;