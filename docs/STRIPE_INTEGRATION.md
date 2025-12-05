### Section 5: Stripe Integration Summary

**How to implement Stripe Checkout for application fees:**

1. **Create Checkout Session**: When user clicks "Pay", call Edge Function to create a Stripe session. Pass the application ID so we know which application this payment is for. Return the Stripe URL and redirect the user.

2. **Store Payment Request**: Before redirecting, save a record in payment_requests table with the Stripe session ID, application ID, amount, and mark it as 'pending'. This tracks the payment attempt.

3. **Handle Webhook**: Create an Edge Function to receive notifications from Stripe. Verify the signature (for security) and listen for the payment completion event.

4. **Update Payment Status**: When Stripe confirms payment succeeded, update the payment_requests record to 'succeeded' and save the payment ID and timestamp.

5. **Update Application Stage**: Move the application from 'payment_pending' to 'under_review' status. Also create a task for staff to review the application within 48 hours.
