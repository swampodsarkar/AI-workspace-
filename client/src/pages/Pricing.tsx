import { Link } from 'react-router-dom'
import { Check, Sparkles, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    currency: 'BDT',
    popular: false,
    features: ['50 AI chat messages/day', '5 PDF conversions/month', 'Basic document editor', '1GB cloud storage', 'Standard support'],
    bKash: false,
  },
  {
    name: 'Pro Monthly',
    price: '499',
    currency: 'BDT',
    popular: true,
    features: ['Unlimited AI chat', 'Unlimited PDF tools', 'Full document editor', '50GB cloud storage', 'AI image generation', 'Code AI & analysis', 'Priority support'],
    bKash: true,
    nagad: true,
  },
  {
    name: 'Pro Yearly',
    price: '4,999',
    currency: 'BDT',
    popular: false,
    features: ['Everything in Pro Monthly', '100GB cloud storage', 'Early access to new features', 'API access', 'Dedicated support'],
    bKash: true,
    nagad: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    currency: '',
    popular: false,
    features: ['Everything in Pro Yearly', 'Unlimited storage', 'Custom AI models', 'Team management', 'SLA guarantee', '24/7 phone support', 'Custom integrations'],
    bKash: false,
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-dark-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Simple, Transparent Pricing</h1>
          <p className="text-dark-400">Choose the plan that fits your needs. Pay with card or bKash/Nagad.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`card flex flex-col relative ${plan.popular ? 'border-primary-500 ring-1 ring-primary-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  {plan.currency && <span className="text-sm text-dark-400">Tk</span>}
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.currency && <span className="text-dark-400">/{plan.name.includes('Yearly') ? 'yr' : plan.name.includes('Monthly') ? 'mo' : ''}</span>}
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <button className={`w-full py-2.5 rounded-lg font-medium transition-all ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  Get Started <ArrowRight size={16} className="inline ml-1" />
                </button>
                {plan.bKash && (
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium transition-all">bKash</button>
                    {plan.nagad && <button className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-all">Nagad</button>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-dark-400 text-sm">All plans include SSL encryption. 30-day money-back guarantee.</p>
          <Link to="/" className="text-primary-400 text-sm hover:underline mt-2 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
