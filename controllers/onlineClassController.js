import db from '../config/db.js';

export const getOnlineCatalog = async (req, res) => {
    try {
        const [rows] = await db.promise().execute(
            'SELECT * FROM online_class ORDER BY created_at DESC'
        );

        // Ubah format response agar sesuai dengan yang diharapkan frontend
        res.json({
            success: true,
            catalog: rows  // Langsung kirim array catalog
        });
    } catch (error) {
        console.error('Error fetching online classes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch online classes'
        });
    }
};

export const getOnlineClassById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.promise().execute(
            'SELECT * FROM online_class WHERE id_item_online_class = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Online class not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching online class:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch online class details'
        });
    }
};