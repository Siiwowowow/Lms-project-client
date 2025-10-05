import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // fetch course info
  const { isLoading, data: courseInfo = {} } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courses/${courseId}`);
      return res.data;
    },
    enabled: !!courseId,
  });

  if (isLoading) return <p>Loading...</p>;

  const amount = Number(courseInfo?.price) || 0;
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!user?.email) {
      setErrorMessage('You must be logged in to make a payment.');
      return;
    }
    if (!courseId) {
      setErrorMessage('Course ID missing.');
      return;
    }
    if (!stripe || !elements) {
      setErrorMessage('Payment system not ready. Please refresh the page.');
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setErrorMessage('Card element not found.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccess(false);

    try {
      console.log('Creating PaymentIntent for', { amountInCents, courseId, userEmail: user.email });

      // 1) create payment intent
      const piRes = await axiosSecure.post('/create-payment-intent', { amountInCents, courseId });
      console.log('create-payment-intent response:', piRes.data);

      const clientSecret = piRes?.data?.clientSecret;
      if (!clientSecret) {
        throw new Error('No client secret returned from server.');
      }

      console.log('Confirming card payment with Stripe...');
      // 2) confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || user?.name || 'Unknown User',
            email: user?.email,
          },
        },
      });

      console.log('Stripe confirm result:', result);

      if (result.error) {
        // Stripe-level error (card declined, authentication, etc.)
        console.error('Stripe error:', result.error);
        setErrorMessage(result.error.message || 'Payment failed with Stripe.');
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status !== 'succeeded') {
        console.error('PaymentIntent status not succeeded:', result.paymentIntent);
        setErrorMessage(`Payment not completed. Status: ${result.paymentIntent?.status}`);
        setLoading(false);
        return;
      }

      // 3) Save payment record to backend
      const paymentPayload = {
        // include multiple keys (some backends expect "userEmail", others "email")
        userEmail: user.email.toLowerCase(),
        email: user.email.toLowerCase(),

        courseId,
        amount, // dollars (decimal)
        amountInCents, // integer cents

        // stripe ids
        paymentIntentId: result.paymentIntent.id,
        transactionId: result.paymentIntent.id, // some code uses transactionId
        paymentMethod: Array.isArray(result.paymentIntent?.payment_method_types)
          ? result.paymentIntent.payment_method_types[0]
          : result.paymentIntent?.payment_method_types,
        status: result.paymentIntent.status || 'succeeded',
        createdAt: new Date().toISOString(),
      };

      console.log('Sending payment record to backend:', paymentPayload);
      const saveRes = await axiosSecure.post('/payments', paymentPayload).catch((err) => {
        // log error then rethrow so outer catch handles UI message
        console.error('Backend /payments error (caught):', err.response?.data || err.message || err);
        throw err;
      });

      console.log('/payments response:', saveRes?.data);

      // Accept several server success shapes
      const serverOk =
        saveRes?.data?.success === true ||
        !!saveRes?.data?.insertedId ||
        saveRes?.status === 200;

      if (!serverOk) {
        console.error('Backend indicated failure when saving payment:', saveRes?.data);
        setErrorMessage(
          saveRes?.data?.error ||
            saveRes?.data?.message ||
            'Payment saved but server returned an unexpected response.'
        );
        setLoading(false);
        return;
      }

      // success
      setSuccess(true);
      setErrorMessage('');
      console.log('Payment complete and saved. Redirecting to course player...');

      // redirect and pass a success message
      setTimeout(() => {
        navigate(`/player/${courseId}`, {
          state: { message: '✅ Your course has been unlocked after payment!' },
        });
      }, 900);
    } catch (err) {
      console.error('Payment flow error:', err);
      // prefer server's error message if available
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setErrorMessage(serverMsg || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4"
    >
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }}
        className="border border-gray-300 p-3 rounded-md"
      />

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-500 disabled:bg-gray-400 transition"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>

      {errorMessage && (
        <div className="text-red-600 text-sm whitespace-pre-wrap">{errorMessage}</div>
      )}
      {success && (
        <div className="text-green-600 text-sm">
          ✅ Payment successful! Redirecting to your course...
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
