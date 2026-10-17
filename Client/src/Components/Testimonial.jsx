import Title from './Title';
import {motion} from 'motion/react'

const Testimonial = () => {
    const testimonials = [
        {
            name: "Ramesh Patel",
            location: "Varanasi, UP",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            rating: 5,
            review: "Rented a Mahindra 275 DI for my wheat harvest season. The tractor was in excellent mechanical condition, delivered right on time, and saved us massive labor expenses!"
        },
        {
            name: "Suresh Yadav",
            location: "Gorakhpur, UP",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
            rating: 5,
            review: "Very smooth booking experience. Swaraj 735 FE had great fuel efficiency for plowing 10 acres. Transparent daily rates with zero hidden charges. Highly recommended!"
        },
        {
            name: "Anil Maurya",
            location: "Mirzapur, UP",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
            rating: 5,
            review: "As an agricultural contractor, I frequently need extra equipment during peak sowing seasons. TractorHub provides reliable machines whenever my local fleet is fully booked."
        }
    ];
  return (
   <div className="flex flex-col mt-25">
    <Title
        title="What Farmers & Contractors Say"
        subtitle="Discover why farmers across Uttar Pradesh trust TractorHub for modern, reliable farming equipment"/>

    <div className="flex flex-wrap justify-center gap-8 mt-12 px-4 mb-20">
        {testimonials.map((testimonial, index) => (
            <motion.div
            initial={{opacity: 0, y: 40}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: index * 0.2, ease: 'easeOut'}}
            viewport={{once: true, amount: 0.3}}
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500 w-full sm:w-75 md:w-87.5"
            >
                <div className="flex items-center gap-3">
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={testimonial.image}
                        alt={testimonial.name}
                    />

                    <div>
                        <p className="text-lg font-semibold">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 mt-4">
                    {Array(5).fill(0).map((_, index) => (
                            <span key={index}className={testimonial.rating > index? "text-orange-500": "text-gray-300"}>★</span>
                        ))}
                </div>

                <p className="text-gray-500 mt-4 font-light">"{testimonial.review}"</p>
            </motion.div>
        ))}
    </div>
</div>
  )
}
export default Testimonial
