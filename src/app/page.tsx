"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineChevronRight,
  HiOutlineLightningBolt
} from 'react-icons/hi';

const features = [
  {
    icon: <HiOutlineScale className="w-6 h-6" />,
    title: 'Legal Expertise',
    description: 'Access to experienced lawyers specializing in various legal areas'
  },
  {
    icon: <HiOutlineChatAlt2 className="w-6 h-6" />,
    title: 'Direct Communication',
    description: 'Seamless communication with your legal team through our platform'
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6" />,
    title: 'Document Management',
    description: 'Secure storage and easy sharing of case-related documents'
  },
  {
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    title: 'Secure & Confidential',
    description: 'Your data is protected with enterprise-grade security measures'
  }
];

const services = [
  {
    title: 'Criminal Law',
    description: 'Defense against criminal charges and legal representation',
    color: 'bg-blue-500'
  },
  {
    title: 'Family Law',
    description: 'Divorce, custody, and other family-related legal matters',
    color: 'bg-green-500'
  },
  {
    title: 'Civil Law',
    description: 'Resolution of disputes between individuals or organizations',
    color: 'bg-purple-500'
  },
  {
    title: 'Corporate Law',
    description: 'Legal services for businesses and corporations',
    color: 'bg-orange-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Professional Legal Services at Your Fingertips
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Connect with experienced lawyers and manage your legal matters efficiently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center
                px-6 py-3 rounded-lg bg-white text-primary-600 font-medium
                hover:bg-primary-50 transition-colors">
                Get Started
                <HiOutlineChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center
                px-6 py-3 rounded-lg bg-primary-700 text-white font-medium
                hover:bg-primary-600 transition-colors">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Why Choose Us
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience the future of legal services with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm
                  hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30
                  rounded-lg flex items-center justify-center text-primary-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Our Services
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive legal solutions for all your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className={`absolute inset-0 ${service.color} opacity-10
                  group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-8">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {service.description}
                  </p>
                  <Link href="/services" className="inline-flex items-center text-primary-500
                    hover:text-primary-600 font-medium">
                    Learn More
                    <HiOutlineChevronRight className="ml-1 w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-100">
                Join thousands of satisfied clients who trust our legal services
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/register" className="inline-flex items-center justify-center
                px-6 py-3 rounded-lg bg-white text-primary-600 font-medium
                hover:bg-primary-50 transition-colors">
                Sign Up Now
                <HiOutlineLightningBolt className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center
                px-6 py-3 rounded-lg bg-primary-800 text-white font-medium
                hover:bg-primary-700 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
