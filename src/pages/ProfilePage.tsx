import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CreditCard,

  Mail,
  Shield,
 
  Star,
  LogOut,
  Edit,
  Users,
} from 'lucide-react';
import SideBar from '@/components/userProfile/SideBar';
import SubscriptionPlan from '@/components/userProfile/SubscriptionPlanData';



export function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const user = useSelector((state: RootState) => state.auth?.user);

  // Mock user data - replace with actual user data from your auth state
  const profileData = {
    name: user?.email?.split('@')[0] || 'Manish Gupta',
    email: user?.email || 'dev.manish.gupta17@gmail.com',
    avatar: '',
    plan: 'Free Plan',
    subscription: null,
    joinDate: 'June 2024',
  };

  const { subscriptionalPlans } = useSelector((state: RootState) => state.subscriptionPlan);
   console.log('subscriptionalPlans', subscriptionalPlans);
  const planFeatures = {
    free: [
      'Up to 3 projects',
      'Basic design tools',
      'Community support',
      '1GB storage',
    ],
    pro: [
      'Unlimited projects',
      'Advanced design tools',
      'Priority support',
      '50GB storage',
      'Team collaboration',
      'Export in high resolution',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
       <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          {/* User Section */}
          {/* <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Personal</p>
                <p className="text-sm text-gray-500">{profileData.plan}</p>
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <div className="py-4 space-y-6">
            <SideBar/>
          </div>

          {/* Upgrade Button */}
          {/* <div className="absolute bottom-4 left-4 right-4">
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => setActiveSection('upgrade')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div> */}

          {/* User Info at Bottom */}
          <div className="absolute bottom-16 left-4 right-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback>
                  {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profileData.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Profile Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Profile Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="text-2xl">
                        {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {profileData.name}
                      </h2>
                      <p className="text-gray-600 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {profileData.email}
                      </p>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          {profileData.plan}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Member since {profileData.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-600">
                        You currently do not have a subscription.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Upgrade to unlock premium features and unlimited access.
                      </p>
                    </div>
                    <Button
                     onClick={() => setActiveSection('upgrade')}
                    >Upgrade Plan</Button>
                  </div>

                  {/* Current Plan Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Current Plan Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {planFeatures.free.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 mr-2 text-gray-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Us Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions, chat with us directly or email us at{' '}
                    <a
                      href="mailto:support@renovateai.app"
                      className="text-blue-600 hover:underline"
                    >
                      support@renovateai.app
                    </a>
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Upgrade Plan Section */}
          {activeSection === 'upgrade' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Plan</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Free Plan</span>
                      <Badge variant="secondary">Current</Badge>
                    </CardTitle>
                    <div className="text-3xl font-bold">$0<span className="text-lg text-gray-500">/month</span></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {planFeatures.free.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {subscriptionalPlans && subscriptionalPlans.length>0 &&
                subscriptionalPlans.map((plan) => (
                  <SubscriptionPlan
                   plan={plan}
                  />
                ))}
                
              </div>

            </motion.div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Other sections can be added similarly */}
          {!['profile', 'upgrade', 'settings'].includes(activeSection) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section coming soon...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
