import React from 'react';
import { 
  DollarSign, 
  Shield, 
  Clock, 
  FileText, 
  ChevronRight,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdUnit } from './AdUnit';
import { Navbar } from './Navbar';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Cash Drawer Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional cash drawer tracking and management solution for businesses.
            Streamline your cash handling operations with comprehensive drawer management.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start Managing Cash <ChevronRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Cash Management Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Building2 size={24} />}
              title="Multi-Organization Support"
              description="Manage multiple organizations with separate cash drawers and detailed reporting capabilities."
            />
            <FeatureCard
              icon={<DollarSign size={24} />}
              title="Accurate Cash Tracking"
              description="Track bills, coins, rolls, and receipts with precision and real-time balance updates."
            />
            <FeatureCard
              icon={<Clock size={24} />}
              title="Shift Management"
              description="Open and close shifts with detailed balance tracking and shift drop functionality."
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="Detailed Reports"
              description="Generate comprehensive PDF reports for accounting and auditing purposes."
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AdUnit slot="side-1" format="rectangle" className="mx-auto max-w-[300px]" />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Solution?</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <Shield className="flex-shrink-0 w-6 h-6 text-blue-600 mr-2" />
                    <span>Secure local data storage with no external dependencies</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="flex-shrink-0 w-6 h-6 text-blue-600 mr-2" />
                    <span>Real-time balance tracking and shift management</span>
                  </li>
                  <li className="flex items-start">
                    <FileText className="flex-shrink-0 w-6 h-6 text-blue-600 mr-2" />
                    <span>Detailed PDF reports for accounting and auditing</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1">
              <AdUnit slot="side-2" format="rectangle" className="mx-auto max-w-[300px]" />
            </div>
          </div>
        </div>
      </div>

      {/* In-content Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot="in-article" className="mx-auto max-w-[728px]" />
      </div>

      {/* Footer with Policies */}
      <footer id="privacy" className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Privacy Policy</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                  The Cash Drawer Management System is committed to protecting your privacy. We collect
                  and store only essential business information necessary for cash drawer management:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Organization names (optional)</li>
                  <li>Drawer numbers</li>
                  <li>Cashier names</li>
                  <li>Shift records and transaction data</li>
                </ul>
                <p>
                  All data is stored locally in your browser using secure IndexedDB storage. We do not
                  transmit or share your data with third parties. Your cash drawer information remains
                  completely private and under your control.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Usage Policy</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Our application processes data in accordance with standard business practices and
                  Google's data usage requirements:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Data is stored locally and encrypted in your browser</li>
                  <li>No personal information is collected beyond business operations</li>
                  <li>PDF reports are generated locally and never uploaded</li>
                  <li>You maintain full control over your data</li>
                  <li>Data can be exported or deleted at any time</li>
                </ul>
                <p>
                  We use Google AdSense to display relevant advertisements. AdSense may use cookies
                  and data as outlined in Google's privacy policy to provide targeted advertising.
                  You can opt out of personalized advertising through Google's Ad Settings.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Ad Banner */}
          <div className="mt-8 pt-8 border-t">
            <AdUnit slot="bottom-banner" className="mx-auto max-w-[728px]" />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Cash Drawer Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}