import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { plans, createCheckoutSession } from '../lib/stripe';
import { toast } from 'sonner';

export function PricingPage() {
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    try {
      if (plan === 'enterprise') {
        navigate('/contact');
        return;
      }

      await createCheckoutSession(plan);
    } catch (error) {
      toast.error('Failed to start subscription process');
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-purple-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose your plan
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start with our Starter plan and scale as you grow. All plans include our core features.
        </p>

        <div className="mt-16 grid max-w-lg grid-cols-1 gap-8 mx-auto lg:max-w-none lg:grid-cols-3">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {key === 'starter' 
                    ? 'Perfect for single location restaurants'
                    : key === 'professional'
                    ? 'Ideal for growing businesses'
                    : 'For large enterprises with custom needs'
                  }
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {plan.price}
                    </span>
                  )}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-purple-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(key)}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${
                  key === 'professional'
                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {key === 'enterprise' ? 'Contact Sales' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}