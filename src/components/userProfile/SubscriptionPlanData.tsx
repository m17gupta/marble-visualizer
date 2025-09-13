// import React from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
// import { Badge, Crown, Star, Zap } from 'lucide-react'
// import { Button } from 'react-day-picker'
// import { SubscriptionPlanModel } from '@/models/subscriptionPlan/SubscriptionPlanModel'


// type SubscriptionPlanProps = {
//     plan: SubscriptionPlanModel
// }
// const SubscriptionPlanData = ({ plan }: SubscriptionPlanProps) => {

//     console.log('SubscriptionPlanData-->', plan)
//     return (
//         <>

//             <Card className="border-2 border-blue-500 relative"
//                 key={plan.id}
//             >
//                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                     <Badge className="bg-blue-500">{plan.name}</Badge>
//                 </div>
//                 <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                         <span>{plan.name}</span>
//                         <Zap className="h-5 w-5 text-blue-500" />
//                     </CardTitle>
//                     <div className="text-3xl font-bold">${plan.price}<span className="text-lg text-gray-500">/month</span></div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {plan.features.map((feature, index) => (
//                       <div key={index} className="flex items-center text-sm">
//                         <Star className="h-4 w-4 mr-2 text-green-500" />
//                         {feature}
//                       </div>
//                     ))}
//                     <Button className="w-full mt-4">
//                         <Crown className="h-4 w-4 mr-2" />
//                         Upgrade to Pro
//                     </Button>
//                 </CardContent>
//             </Card></>
//     )
// }

// export default SubscriptionPlanData