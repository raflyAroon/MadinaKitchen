import db from '../config/db.js';

export const createPayment = (req, res) => {
    const {
        jenis_payClass,
        quantity_payClass,
        total_priceClass,
        id_item_online_class,
        id
    } = req.body;

    const formattedPrice = `Rp. ${parseInt(total_priceClass).toLocaleString('id-ID')}`;

    const query = `
        INSERT INTO pay_class (
            jenis_payClass, 
            status_payClass, 
            total_priceClass, 
            quantity_payClass,
            created_at,
            updated_at,
            id,
            id_item_online_class
        ) VALUES (?, 'pending', ?, ?, NOW(), NOW(), ?, ?)
    `;

    db.execute(query, [
        jenis_payClass,
        formattedPrice,
        quantity_payClass,
        id,
        id_item_online_class
    ], (error, result) => {
        if (error) {
            console.error('Payment creation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment',
                error: error.message
            });
        }

        res.status(201).json({
            success: true,
            paymentId: result.insertId,
            message: 'Payment created successfully'
        });
    });
};

export const getPaymentStatus = (req, res) => {
    const { paymentId } = req.params;

    const query = `
        SELECT * FROM pay_class 
        WHERE id_payClass = ?
    `;

    db.execute(query, [paymentId], (error, rows) => {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch payment status',
                error: error.message
            });
        }

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            payment: rows[0]
        });
    });
};

export const getUserPayments = async (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT p.*, c.name_class, c.image_class 
        FROM pay_class p
        JOIN online_class c ON p.id_item_online_class = c.id_item_online_class
        WHERE p.id = ?
        ORDER BY p.created_at DESC
    `;

    try {
        const [rows] = await db.promise().execute(query, [userId]);
        res.json({
            success: true,
            payments: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user payments'
        });
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { paymentId } = req.params;
    const { status } = req.body;

    const query = `
        UPDATE pay_class
        SET status_payClass = ?, 
            updated_at = NOW() 
        WHERE id_payClass = ?
    `;

    try {
        await db.promise().execute(query, [status, paymentId]);
        res.json({
            success: true,
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status'
        });
    }
};

export const confirmPayment = async (req, res) => {
    const { paymentId } = req.params;
    const userId = req.user.id;

    try {
        // Cek apakah pembayaran ada dan milik user yang benar
        const [payment] = await db.promise().execute(
            'SELECT * FROM pay_class WHERE id_payClass = ? AND id = ?',
            [paymentId, userId]
        );

        if (!payment[0]) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found or unauthorized'
            });
        }

        // Update status pembayaran menjadi 'waiting_confirmation'
        await db.promise().execute(
            'UPDATE pay_class SET status_payClass = ?, updated_at = NOW() WHERE id_payClass = ?',
            ['waiting_confirmation', paymentId]
        );

        res.json({
            success: true,
            message: 'Payment confirmation submitted successfully'
        });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm payment'
        });
    }
};
