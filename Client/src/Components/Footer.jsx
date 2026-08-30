import { motion } from "motion/react";

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Best Sellers", href: "/tractors" },
        { label: "Offers & Deals", href: "/offers" },
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faq" },
      ],
    },
    {
      title: "Need Help?",
      links: [
        { label: "Delivery Information", href: "/delivery" },
        { label: "Return & Refund Policy", href: "/returns" },
        { label: "Payment Methods", href: "/payments" },
        { label: "Track Your Order", href: "/track-order" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "Twitter", href: "https://twitter.com" },
        { label: "Facebook", href: "https://facebook.com" },
        { label: "YouTube", href: "https://youtube.com" },
      ],
    },
  ];

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 border-t border-gray-200 mt-10">
      <div className="flex flex-col md:flex-row justify-between gap-10 py-10 border-b border-gray-300">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            className="w-32"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg"
            alt="Logo"
          />
          <p className="max-w-xl mt-6 text-gray-500">
            TractorRent makes it easy to find reliable tractors for every
            farming need. Compare options, book with confidence, and get the
            right equipment when you need it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="flex flex-wrap justify-between w-full md:w-[45%] gap-8"
        >
          {linkSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>

              <ul className="space-y-2 text-sm text-gray-500">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="hover:text-blue-600 transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>

      <p className="py-4 text-center text-sm text-gray-500">
        © 2025 PrebuiltUI. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
