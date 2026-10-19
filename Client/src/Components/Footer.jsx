import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "All Tractors", href: "/tractor" },
        { label: "My Bookings", href: "/mybooking" },
        { label: "Owner Dashboard", href: "/owner" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Tractor Rentals", href: "/tractor" },
        { label: "Equipment Booking", href: "/tractor" },
        { label: "Seasonal Plowing", href: "/tractor" },
        { label: "Harvester & Implements", href: "/tractor" },
      ],
    },
    {
      title: "Contact & Social",
      links: [
        { label: "Uttar Pradesh, India", href: "#" },
        { label: "support@tractorhub.in", href: "mailto:support@tractorhub.in" },
        { label: "+91 98765 43210", href: "tel:+919876543210" },
      ],
    },
  ];

  return (
    <footer className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200 mt-10">
      <div className="flex flex-col lg:flex-row justify-between gap-10 py-10 border-b border-gray-300">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:w-[36%]"
        >
          <Link to="/">
            <img
              className="h-10 rounded-2xl w-36 border-2 object-contain"
              src={assets.Rental_Logo3}
              alt="TractorHub Logo"
            />
          </Link>
          <p className="max-w-xl mt-6 text-gray-500">
            TractorHub makes it easy to find reliable agricultural tractors and heavy farming machinery.
            Compare models, book by day, and get the right equipment delivered for your next harvest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:w-[58%] lg:grid-cols-3 lg:gap-6 xl:gap-10"
        >
          {linkSections.map((section, index) => (
            <div key={index} className="min-w-0">
              <h3 className="font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>

              <ul className="space-y-2 text-sm text-gray-500">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.href.startsWith("/") ? (
                      <Link to={link.href} className="hover:text-blue-600 transition">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="hover:text-blue-600 transition">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>

      <p className="py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TractorHub. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
