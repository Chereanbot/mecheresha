"use client";

import { motion } from 'framer-motion';
import { 
  HiOutlineScale,
  HiOutlineUserGroup,
  HiOutlineGlobe,
  HiOutlineLightBulb,
  HiOutlineHeart,
  HiOutlineChevronDown,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiOutlineSparkles
} from 'react-icons/hi';

// Add new interfaces
interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: JSX.Element;
}

interface Award {
  title: string;
  organization: string;
  year: string;
  image: string;
  description: string;
}

export default function AboutPage() {
  const features = [
    {
      icon: <HiOutlineScale className="w-8 h-8" />,
      title: 'Legal Expertise',
      description: 'Access to experienced lawyers specializing in various legal domains'
    },
    {
      icon: <HiOutlineUserGroup className="w-8 h-8" />,
      title: 'Client-Focused',
      description: 'Personalized attention and dedicated support throughout your legal journey'
    },
    {
      icon: <HiOutlineGlobe className="w-8 h-8" />,
      title: 'Accessibility',
      description: 'Easy access to legal services through our digital platform'
    }
  ];

  const values = [
    {
      icon: <HiOutlineLightBulb className="w-6 h-6" />,
      title: 'Innovation',
      description: 'Leveraging technology to improve legal services'
    },
    {
      icon: <HiOutlineHeart className="w-6 h-6" />,
      title: 'Integrity',
      description: 'Maintaining highest ethical standards in all our dealings'
    }
  ];

  const statistics = [
    { number: '1000+', label: 'Cases Handled' },
    { number: '50+', label: 'Expert Lawyers' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Support' }
  ];

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Senior Lawyer',
      image: '/team/member1.jpg',
      specialization: 'Criminal Law'
    },
    {
      name: 'Jane Smith',
      role: 'Case Manager',
      image: '/team/member2.jpg',
      specialization: 'Family Law'
    },
    // Add more team members
  ];

  const testimonials = [
    {
      quote: "The best legal service I've ever experienced",
      author: "Michael Brown",
      role: "Business Owner",
      image: "/testimonials/1.jpg"
    },
    // Add more testimonials
  ];

  const faqs: FAQ[] = [
    {
      question: "How does the legal consultation process work?",
      answer: "Our consultation process begins with an initial meeting where we discuss your case details and legal needs. We then evaluate the best course of action and provide you with a clear strategy.",
      category: "Services"
    },
    {
      question: "What areas of law do you specialize in?",
      answer: "We specialize in various areas including criminal law, civil litigation, family law, corporate law, and intellectual property law.",
      category: "Expertise"
    },
    // Add more FAQs
  ];

  const timeline: TimelineEvent[] = [
    {
      year: "2020",
      title: "Company Founded",
      description: "DulaCMS was established with a vision to revolutionize legal case management.",
      icon: <HiOutlineSparkles className="w-6 h-6" />
    },
    {
      year: "2021",
      title: "Digital Transformation",
      description: "Launched our innovative digital platform for seamless case management.",
      icon: <HiOutlineGlobeAlt className="w-6 h-6" />
    },
    // Add more timeline events
  ];

  const awards: Award[] = [
    {
      title: "Legal Innovation Award",
      organization: "Legal Tech Association",
      year: "2023",
      image: "/awards/innovation.png",
      description: "Recognized for revolutionary case management solutions"
    },
    // Add more awards
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const StatisticsSection = () => (
    <motion.div
      className="py-24 bg-white dark:bg-gray-800"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }}
                className="text-4xl md:text-5xl font-bold text-primary-500 mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const TeamSection = () => (
    <motion.div
      className="py-24 bg-white dark:bg-gray-800"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meet Our Team
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Expert professionals dedicated to your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-primary-500 font-medium">{member.role}</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {member.specialization}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const TestimonialsSection = () => (
    <motion.div
      className="py-24 bg-gray-50 dark:bg-gray-900"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Real feedback from satisfied clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative"
            >
              <div className="absolute -top-4 -left-4">
                <HiOutlineStar className="w-8 h-8 text-primary-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const FAQSection = () => (
    <motion.div
      className="py-24 bg-white dark:bg-gray-800"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
              <span className="inline-block mt-4 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 
                text-primary-600 dark:text-primary-400 text-sm rounded-full">
                {faq.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const TimelineSection = () => (
    <motion.div
      className="py-24 bg-gray-50 dark:bg-gray-900"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Journey
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Milestones that shaped our success
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary-200 dark:bg-primary-800" />

          <div className="space-y-16">
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-primary-500 rounded-lg text-white">
                        {event.icon}
                      </div>
                      <div>
                        <span className="text-primary-500 font-bold">{event.year}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const AwardsSection = () => (
    <motion.div
      className="py-24 bg-white dark:bg-gray-800"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Awards & Recognition
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Celebrating our achievements in legal innovation
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-24 h-24 mx-auto mb-6 object-contain"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                  {award.title}
                </h3>
                <div className="mt-2 text-center">
                  <p className="text-primary-500">{award.organization}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{award.year}</p>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
                  {award.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const NewsletterSection = () => (
    <motion.div
      className="py-24 bg-gradient-to-br from-primary-500/20 via-primary-500/10 to-transparent"
      variants={staggerChildren}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Stay Updated
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for legal insights and company updates
            </p>
          </motion.div>

          <motion.form 
            variants={fadeInUp}
            className="mt-8 flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle newsletter subscription
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-2 border-primary-500/20 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-primary-500 text-white rounded-full
                hover:bg-primary-600 transition-colors duration-300"
            >
              Subscribe
            </button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative bg-white dark:bg-gray-800 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              About <span className="text-primary-500 relative">
                DulaCMS
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>
            </h1>
            <motion.p 
              className="mt-6 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Empowering legal professionals and clients with innovative case management solutions.
            </motion.p>
            
            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <HiOutlineChevronDown className="w-6 h-6 text-primary-500" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section with Card Hover Effects */}
      <motion.div 
        className="py-24 bg-gray-50 dark:bg-gray-900"
        variants={staggerChildren}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              What Sets Us Apart
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Our commitment to excellence and innovation in legal services
            </p>
          </motion.div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center
                    transform transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center
                      shadow-lg text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mt-12 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <StatisticsSection />

      {/* Values Section with Gradient Cards */}
      <motion.div 
        className="py-24 bg-white dark:bg-gray-800"
        variants={staggerChildren}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              The principles that guide our service
            </p>
          </motion.div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  className="relative p-8 rounded-xl bg-gradient-to-br from-primary-500/10 to-transparent
                    border border-primary-500/20 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary-500 rounded-lg text-white">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <TimelineSection />
      <AwardsSection />
      <NewsletterSection />

      {/* Contact Section with Floating Button */}
      <motion.div 
        className="py-24 bg-gray-50 dark:bg-gray-900"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Get in Touch
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Have questions? We're here to help.
            </p>
            <motion.div 
              className="mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border border-transparent 
                  text-lg font-medium rounded-full shadow-lg text-white 
                  bg-primary-500 hover:bg-primary-600 transition-all duration-300
                  hover:shadow-primary-500/50"
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 