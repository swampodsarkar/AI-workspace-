import { Link } from 'react-router-dom'
import { Icons } from '../lib/icons'
import { getRemaining } from '../lib/usage'

const plans = [
  {
    name: 'Free',
    price: '0',
    currency: 'BDT',
    period: '',
    popular: false,
    icon: Icons.Zap,
    iconColor: 'from-yellow-400 to-yellow-500',
    features: ['50 AI chat messages/day', '5 PDF conversions/month', 'Basic document editor', '1GB cloud storage', 'Standard support'],
    bKash: false,
  },
  {
    name: 'Pro Monthly',
    price: '499',
    currency: 'BDT',
    period: '/mo',
    popular: true,
    icon: Icons.Star,
    iconColor: 'from-primary-400 to-purple-500',
    features: ['Unlimited AI chat', 'Unlimited PDF tools', 'Full document editor', '50GB cloud storage', 'AI image generation', 'Code AI & analysis', 'Priority support'],
    bKash: true,
    nagad: true,
  },
  {
    name: 'Pro Yearly',
    price: '4,999',
    currency: 'BDT',
    period: '/yr',
    popular: false,
    icon: Icons.Shield,
    iconColor: 'from-green-400 to-emerald-500',
    features: ['Everything in Pro Monthly', '100GB cloud storage', 'Early access to new features', 'API access', 'Dedicated support'],
    bKash: true,
    nagad: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    currency: '',
    period: '',
    popular: false,
    icon: Icons.Crown,
    iconColor: 'from-orange-400 to-red-500',
    features: ['Everything in Pro Yearly', 'Unlimited storage', 'Custom AI models', 'Team management', 'SLA guarantee', '24/7 phone support', 'Custom integrations'],
    bKash: false,
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-dark-900 py-16 px-4 relative">
      <div className="absolute inset-0 dotted-bg opacity-30" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 badge-primary mb-4">Pricing</div>
          <h1 className="text-4xl font-bold mb-3">Simple, Transparent <span className="gradient-text">Pricing</span></h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">Choose the plan that fits your needs. Pay with card, bKash, or Nagad.</p>
          {getRemaining() < 50 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-xl px-4 py-2 text-sm text-primary-400">
              <Icons.Zap size={14} />
              You have <strong>{getRemaining()}</strong> free requests remaining today
            </div>
          )}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <div key={i} className={`relative flex flex-col bg-dark-800/60 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 animate-fade-in-up ${
              plan.popular
                ? 'border-primary-500/50 ring-1 ring-primary-500/30 shadow-xl shadow-primary-500/10 scale-[1.02] lg:scale-105'
                : 'border-dark-700/60 hover:border-dark-600/80'
            }`} style={{ animationDelay: `${i * 100}ms` }}>
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-purple-600 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary-600/30 whitespace-nowrap">
                  <Icons.Sparkles size={12} /> Most Popular
                </div>
              )}

              {/* Plan icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.iconColor} flex items-center justify-center mb-4 shadow-lg`}>
                <plan.icon size={20} className="text-white" />
              </div>

              {/* Name + price */}
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                {plan.currency && <span className="text-sm text-dark-500 font-medium">{plan.currency}</span>}
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-dark-500 text-sm">{plan.period}</span>}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-dark-200">
                    <Icons.Check size={15} className={`mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-400' : 'text-green-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Actions */}
              <div className="space-y-2.5">
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'btn-primary'
                    : plan.price === 'Custom'
                    ? 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-600 hover:border-dark-400'
                    : 'btn-secondary'
                }`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  <Icons.ArrowRight size={15} />
                </button>

                {plan.bKash && (
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-pink-600/20 hover:shadow-lg hover:shadow-pink-500/30">
                      bKash
                    </button>
                    {plan.nagad && (
                      <button className="py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-600/20 hover:shadow-lg hover:shadow-orange-500/30">
                        Nagad
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-dark-400 text-sm bg-dark-800/50 border border-dark-700/50 rounded-xl px-5 py-3">
            <Icons.Shield size={14} />
            All plans include SSL encryption &bull; 30-day money-back guarantee
          </div>
          <div className="mt-4">
            <Link to="/" className="text-sm text-dark-400 hover:text-dark-200 transition-colors inline-flex items-center gap-1">
              <Icons.ArrowRight size={12} className="rotate-180" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
