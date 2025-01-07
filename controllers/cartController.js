import db from "../config/db.js";

export const getCart = (req, res) => {
    const userId = req.user.id;
    
    const getCakeItems = `
        SELECT 
            'cake' as item_type,
            id_item_cake as item_id,
            name_item as name,
            price_item as price,
            image_item as image,
            category_item as category
        FROM cake_dessert 
        WHERE id_item_cake IN (
            SELECT item_id FROM user_cart WHERE user_id = ? AND item_type = 'cake'
        )`;

    db.query(getCakeItems, [userId], (err, cakeItems) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch cart items',
                error: err.message
            });
        }

        const getClassItems = `
            SELECT 
                'class' as item_type,
                id_item_online_class as item_id,
                name_class as name,
                price_class as price,
                image_class as image,
                category_item_class as category
            FROM online_class 
            WHERE id_item_online_class IN (
                SELECT item_id FROM user_cart WHERE user_id = ? AND item_type = 'class'
            )`;

        db.query(getClassItems, [userId], (err, classItems) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch cart items',
                    error: err.message
                });
            }

            res.json({
                success: true,
                cart: [...cakeItems, ...classItems]
            });
        });
    });
};

export const addToCart = (req, res) => {
    const userId = req.user.id;
    const { itemId, itemType } = req.body;

    const checkItemQuery = itemType === 'cake' 
        ? 'SELECT id_item_cake FROM cake_dessert WHERE id_item_cake = ?'
        : 'SELECT id_item_online_class FROM online_class WHERE id_item_online_class = ?';

    db.query(checkItemQuery, [itemId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item added to cart successfully',
            itemData: {
                id: itemId,
                type: itemType,
                quantity: 1
            }
        });
    });
};

export const updateCartItem = (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    db.query(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND item_id = ?',
        [quantity, userId, itemId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update cart item',
                    error: err.message
                });
            }
            
            res.json({
                success: true,
                message: 'Cart item updated successfully'
            });
        }
    );
};

export const removeFromCart = (req, res) => {
    const userId = req.user.id;
    const { itemId } = req.params;

    db.query(
        'DELETE FROM cart WHERE user_id = ? AND item_id = ?',
        [userId, itemId],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to remove item from cart',
                    error: err.message
                });
            }
            
            res.json({
                success: true,
                message: 'Item removed from cart successfully'
            });
        }
    );
};

export const clearCart = (req, res) => {
    const userId = req.user.id;

    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to clear cart',
                error: err.message
            });
        }
        
        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    });
};
