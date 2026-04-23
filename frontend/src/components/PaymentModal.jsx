import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Recommendation: Apni key ko .env file mein rakhein (VITE_STRIPE_PUBLIC_KEY)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_key');

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'requires_capture') {
      onSuccess();
    } else {
      setErrorMessage("Something went wrong with the payment status.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col space-y-3 mt-8">
        <button 
          type="submit" 
          disabled={isProcessing || !stripe} 
          className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all transform active:scale-95 ${
            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Securing Funds...
            </span>
          ) : (
            `Pay ₹${amount.toLocaleString()} to Escrow`
          )}
        </button>
        
        <button 
          type="button" 
          onClick={onClose} 
          disabled={isProcessing} 
          className="w-full py-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition"
        >
          Cancel and return to dashboard
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ clientSecret, amount, onSuccess, onClose }) => {
  // Appearance customization for Stripe
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb', // Matches your blue-600
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      borderRadius: '8px',
    },
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative border border-gray-100">
        {/* Trust Badges */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Secure Escrow</span>
          </div>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-50" />
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-1">Fund Project</h2>
        <p className="text-sm text-gray-500 mb-8">
          Funds will be held by <strong>UttamSewa</strong> and released only when you approve the work.
        </p>
        
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        ) : (
          <div className="flex flex-col items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-sm font-medium animate-pulse">Initializing secure gateway...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;