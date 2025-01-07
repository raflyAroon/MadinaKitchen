import db from '../config/db.js';

export const submitClassReview = async (req, res) => {
    const { rating, comment, id_payClass } = req.body;
    
    try {
        const reviewData = {
            rating,
            comment,
            id_payClass,
            created_at: new Date(),
            updated_at: new Date()
        };

        db.query('INSERT INTO ratereview_class SET ?', reviewData, (err, result) => {
            if (err) {
                console.error('Review submission error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to submit review',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'Review submitted successfully',
                reviewId: result.insertId
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getClassReviews = async (req, res) => {
    const { classId } = req.params;

    db.query(
        'SELECT * FROM ratereview_class WHERE id_payClass = ?',
        [classId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch reviews',
                    error: err.message
                });
            }

            res.status(200).json({
                success: true,
                reviews: results
            });
        }
    );
};
