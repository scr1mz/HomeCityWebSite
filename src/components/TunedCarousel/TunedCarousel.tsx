import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import type { ObjectImage } from '../../utils/types/listingTypes';
import styles from './TunedCarousel.module.scss';
import {ROOT_URL} from '../../services/api/listingApi';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface TunedCarouselProps {
    title: string;
    images: ObjectImage[];
    onClick?: () => void;
    onMenuClick?: (e: any) => void;
    imageIndex: number;
    setImageIndex: (index: number) => void;
}

export const TunedCarousel: React.FC<TunedCarouselProps> = ({ title, images, onClick, onMenuClick, imageIndex, setImageIndex }) => {
    const handleSlideChange = (index: number) => {
        setImageIndex(index);
    };

    return (
        <div className={styles.tunedCarousel}>
            {
                images.length === 0
                    ? (
                        <div className={styles.imageContainer}>
                            <img
                                src={`${ROOT_URL}/uploads/no_image.jpg`}
                                alt={title}
                                className={styles.image}
                                onClick={onClick}
                            />
                        </div>
                    )
                    : (
                        <Carousel
                            showThumbs={false}
                            infiniteLoop
                            onChange={handleSlideChange}
                            showStatus={false}
                            showIndicators={false}
                            onClickItem={onClick}
                            selectedItem={imageIndex}
                        >
                            {images.map((image) => (
                                <div key={image.id} className={styles.imageContainer}>
                                    <img
                                        src={image.image_url}
                                        alt={title}
                                        className={styles.image}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    )
            }
            <div className={styles.footer}>
                {onMenuClick !== undefined && (
                    <IconButton size="small" onClick={onMenuClick} className={styles.menuButton} disableRipple>
                        <MoreVertIcon />
                    </IconButton>
                )}
                {images.length > 0 && (
                    <div className={styles.indicator}>
                        {imageIndex + 1}/{images.length}
                    </div>
                )}
            </div>
        </div>
    );
};
