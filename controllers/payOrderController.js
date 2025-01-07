import db from '../config/db.js';

export const createPayOrder = async (req, res) => {
    const { items, total_price, payment_method, user_id } = req.body;

    try {
        const payOrder = {
            jenis_payOrder: payment_method,
            status_payOrder: 'pending',
            total_priceOrder: total_price,
            quantity_payOrder: items.reduce((sum, item) => sum + item.quantity, 0),
            created_at: new Date(),
            updated_at: new Date(),
            id: user_id,
            id_item_cake: items[0].id_item_cake // For single item orders
        };

        db.query('INSERT INTO pay_order SET ?', payOrder, (err, result) => {
            if (err) {
                console.error('Payment creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create payment order',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: 'Payment order created successfully',
                orderId: result.insertId
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

export const getPayOrderStatus = (req, res) => {
    const { orderId } = req.params;

    db.query(
        'SELECT * FROM pay_order WHERE id_payOrder = ?',
        [orderId],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch order status',
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                success: true,
                order: results[0]
            });
        }
    );
};
