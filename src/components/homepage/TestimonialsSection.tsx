// import React from 'react';
// import { Star } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';

// const TestimonialsSection = () => {
//   const testimonials = [
//     {
//       name: 'Jamie K.',
//       role: 'Homeowner',
//       content: 'This app is amazing! I remodeled my kitchen and the AI tools worked to near perfection. The UI is very fascinating and easy to use.',
//       rating: 5,
//       avatar: 'JK'
//     },
//     {
//       name: 'Sarah M.',
//       role: 'Interior Designer',
//       content: 'Dzinly has revolutionized my design process. I can show clients multiple options instantly and close deals faster than ever.',
//       rating: 5,
//       avatar: 'SM'
//     },
//     {
//       name: 'Mike R.',
//       role: 'Real Estate Agent',
//       content: 'The virtual staging feature is incredible. My listings get 3x more views and sell 40% faster with AI-staged photos.',
//       rating: 5,
//       avatar: 'MR'
//     }
//   ];

//   return (
//     <section id="testimonials" className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             What Our Users Say
//           </h2>
//           <p className="text-xl text-gray-600">
//             Join thousands of satisfied customers transforming their spaces
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <Card key={index} className="shadow-lg border-0">
//               <CardHeader>
//                 <div className="flex items-center mb-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
//                     {testimonial.avatar}
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
//                     <p className="text-gray-600 text-sm">{testimonial.role}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-1">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                   ))}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600 italic leading-relaxed">
//                   "{testimonial.content}"
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;
