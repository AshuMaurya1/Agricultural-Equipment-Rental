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
      title: "Contact & Helpline",
      links: [
        { label: "Uttar Pradesh, India", href: "#" },
        { label: "support@tractorhub.in", href: "mailto:support@tractorhub.in" },
        { label: "Helpline: 1800-120-TRAK", href: "tel:18001208722" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 border-t border-stone-200 mt-12 bg-white">
      <div className="flex flex-col lg:flex-row justify-between gap-8 py-10 border-b border-stone-200">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:w-[36%]"
        >
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <span className="text-lg">🚜</span>
            </div>
            <span className="text-lg font-black text-slate-900">
              Tractor<span className="text-emerald-700">Hub</span>
            </span>
          </Link>
          <p className="max-w-md mt-4 text-xs sm:text-sm text-stone-500 leading-relaxed">
            North India&apos;s trusted agricultural machinery network. Instant rentals by Day, Hour, or Acre with verified drivers and field delivery.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:w-[58%] lg:grid-cols-3"
        >
          {linkSections.map((section, index) => (
            <div key={index} className="min-w-0">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
                {section.title}
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-stone-500">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        onClick={scrollToTop}
                        className="hover:text-emerald-700 transition"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="hover:text-emerald-700 transition">
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

      <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 text-center sm:text-left">
        <p>© {new Date().getFullYear()} TractorHub Kisan Rental Network. All rights reserved.</p>
        <p className="text-emerald-800 font-semibold">Serving Uttar Pradesh & North India 🌾</p>
      </div>
    </footer>
  );
};

export default Footer;
