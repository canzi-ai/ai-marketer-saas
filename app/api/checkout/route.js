import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { priceId } = await request.json();
    const baseUrl = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      line_items: [
        {
          price: priceId || 'price_1TWbX5C3CRNa0CYmjg42J0GJ',
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pricing?success=true`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        product: 'AI商机日报付费版',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
