import React, {useState, useCallback} from 'react';
import RatingSummary from './RatingSummary';
import SectionHeader from '../common/SectionHeader';
import ReviewsList from './ReviewsList';
import ReviewModal from './ReviewModal';

const ReviewsSection = React.memo(({ rating, totalReviews, reviews, onLoadMore, bookTitle, onReviewSubmit }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleWriteReview = useCallback(() => {
        setIsReviewModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsReviewModalOpen(false);
    }, []);

    const handleSubmitReview = useCallback((newReview) => {
        if (onReviewSubmit) {
            onReviewSubmit(newReview);
        }
    }, [onReviewSubmit]);
    return (
        <>
        <div className="border-t border-gray-300 dark:border-gray-600 pt-8">
        <SectionHeader title="Đánh giá & Nhận xét" />
        <div className="grid grid-cols-1">
            <RatingSummary rating={rating} totalReviews={totalReviews}  onWriteReview={handleWriteReview}/>
            <ReviewsList reviews={reviews} onLoadMore={onLoadMore} />
        </div>
        </div>
        {/* Review Modal */}
        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitReview}
            bookTitle={bookTitle}
        />
        </>
    );
});

ReviewsSection.displayName = 'ReviewsSection';
export default ReviewsSection;