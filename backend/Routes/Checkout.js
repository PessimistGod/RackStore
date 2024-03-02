const express = require("express");
const Stripe = require("stripe");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/checkout", async (req, res) => {
    const { cartItems } = req.body;

    try {
        // Create line items for the checkout session
        const lineItems = cartItems.map((cartItem) => {
            return {
                price_data: {
                    currency: "inr", // Adjust currency based on your requirements
                    product_data: {
                        name: cartItem.productId.productName,
                    },
                    unit_amount: cartItem.productId.price * 100, // Convert price to cents
                },
                quantity: cartItem.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // Adjust based on your requirements
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/order-placed`,
            cancel_url: `${process.env.CLIENT_URL}/transaction-error`
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

module.exports = router;
