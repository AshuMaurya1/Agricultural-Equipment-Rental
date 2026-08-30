import Title from './Title';
import {motion} from 'motion/react'

const Testimonial = () => {
    const testimonials = [
        {name: "Emma Rodriguez", location: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "Exceptional service and attention to detail. Everything was handled professionally and efficiently from start to finish. Highly recommended!" },
        {name: "Liam Johnson", location: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "I’m truly impressed by the quality and consistency. The entire process was smooth, and the results exceeded all expectations. Thank you!" },
        {name: "Sophia Lee", location: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results." }
    ];
  return (
   <div className="flex flex-col mt-25">
    <Title
        title="What Our Former Guests Say"
        subtitle="Discover why discerning travelers choose StayVenture for their comfortable accommodations around the world"/>

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
