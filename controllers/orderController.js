import db from '../config/db.js';

export const getCatalog = (req, res) => {
    db.query("SELECT * FROM cake_dessert", (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch catalog',
                error: err.message
            });
        }
        
        res.status(200).json({
            success: true,
            catalog: results
        });
    });
};
