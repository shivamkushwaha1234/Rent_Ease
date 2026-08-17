import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("items.product");
    if (!order || order.user.toString() !== userId) {
      return res.status(404).json({ message: "Order not found" });
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
        unit_amount: Math.round(item.product.monthlyRent * 100),
      },
      quantity: item.quantity * item.tenure,
    }));

    const depositAmount = order.depositAmount || 0;
    if (depositAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Security Deposit",
            description: "Refundable security deposit for rental order",
          },
          unit_amount: Math.round(depositAmount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/orders?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?payment=cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      paymentMethod: "Card",
      status: "Approved",
    });
  }

  res.json({ received: true });
};
