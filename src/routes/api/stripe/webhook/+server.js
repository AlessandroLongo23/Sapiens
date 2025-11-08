import { json } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/server.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { createClient } from '$lib/supabase.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const supabase = createClient(cookies);
	
	let event;

	try {
		const body = await request.text();
		const signature = request.headers.get('stripe-signature');

		if (!signature) {
			return json({ error: 'Missing signature' }, { status: 400 });
		}

		// Verify webhook signature
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		console.error('Webhook signature verification failed:', err.message);
		return json({ error: 'Webhook signature verification failed' }, { status: 400 });
	}

	// Handle the event
	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				const userId = session.metadata.userId;
				const planId = session.metadata.planId;
				const customerId = session.customer;

				// Update user subscription in database
				await supabase
					.from('students')
					.update({
						subscription_plan: planId,
						stripe_customer_id: customerId,
						subscription_status: 'active',
						subscription_updated_at: new Date().toISOString()
					})
					.eq('id', userId);

				console.log(`Subscription activated for user ${userId}, plan: ${planId}`);
				break;
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object;
				const customerId = subscription.customer;

				// Get user by customer ID
				const { data: student } = await supabase
					.from('students')
					.select('id')
					.eq('stripe_customer_id', customerId)
					.single();

				if (student) {
					// Update subscription status
					await supabase
						.from('students')
						.update({
							subscription_status: subscription.status,
							subscription_updated_at: new Date().toISOString()
						})
						.eq('id', student.id);

					console.log(`Subscription updated for customer ${customerId}: ${subscription.status}`);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object;
				const customerId = subscription.customer;

				// Get user by customer ID
				const { data: student } = await supabase
					.from('students')
					.select('id')
					.eq('stripe_customer_id', customerId)
					.single();

				if (student) {
					// Revert to free plan
					await supabase
						.from('students')
						.update({
							subscription_plan: 'free',
							subscription_status: 'canceled',
							subscription_updated_at: new Date().toISOString()
						})
						.eq('id', student.id);

					console.log(`Subscription canceled for customer ${customerId}`);
				}
				break;
			}

			case 'invoice.payment_succeeded': {
				const invoice = event.data.object;
				const customerId = invoice.customer;

				console.log(`Payment succeeded for customer ${customerId}`);
				// You might want to send a confirmation email here
				break;
			}

			case 'invoice.payment_failed': {
				const invoice = event.data.object;
				const customerId = invoice.customer;

				// Get user by customer ID
				const { data: student } = await supabase
					.from('students')
					.select('id, email')
					.eq('stripe_customer_id', customerId)
					.single();

				if (student) {
					// Update subscription status
					await supabase
						.from('students')
						.update({
							subscription_status: 'past_due',
							subscription_updated_at: new Date().toISOString()
						})
						.eq('id', student.id);

					console.log(`Payment failed for customer ${customerId}`);
					// You might want to send a payment failure email here
				}
				break;
			}

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
}

