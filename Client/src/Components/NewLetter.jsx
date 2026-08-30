import { useState } from "react";
import { toast } from "react-hot-toast";
import {motion} from 'motion/react'

const NewLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubscribed(true);
    setEmail("");
    toast.success("Thanks for subscribing!");
  };

  return (
    <motion.div
    initial={{opacity: 0, y: 30}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration: 0.6, ease: 'easeOut'}}
    viewport={{once: true, amount: 0.3}}
    >
    <section className="flex flex-col items-center justify-center text-center space-y-2 mb-20 mt-5" aria-labelledby="newsletter-title">

      <motion.h1 
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: 0.2}}

      id="newsletter-title" className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</motion.h1>

      <motion.p 
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: 0.3}}
      className="md:text-lg text-gray-500/70 pb-8">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts.
      </motion.p>

      <motion.form 
      initial={{opacity:0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{ duration: 0.5, delay: 0.4}}
      onSubmit={handleSubmit} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          required
          disabled={isSubscribed}
        />
        <button
          type="submit"
          disabled={isSubscribed}
          className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull disabled:bg-gray-400 disabled:cursor-not-allowed transition-all cursor-pointer rounded-md rounded-l-none"
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </motion.form>
    </section>
    </motion.div>
  );
};

export default NewLetter;
