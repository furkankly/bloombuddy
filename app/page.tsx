"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { LineChart, BarChart } from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"water" | "humidity">("water");

  const features = [
    {
      title: "Plant Management",
      description:
        "Add and manage your plant collection with detailed profiles for each species.",
      icon: "🌱",
    },
    {
      title: "Water Tracking",
      description:
        "Set custom watering schedules based on each plant's specific needs.",
      icon: "💧",
    },
    {
      title: "Humidity Monitoring",
      description:
        "Track optimal humidity levels for different plant types in your collection.",
      icon: "☁️",
    },
    {
      title: "Data Visualization",
      description:
        "View beautiful charts and analytics about your plants' health and needs.",
      icon: "📊",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-6 md:px-10 py-24 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-700 mb-6">
              BloomBuddy
            </h1>
            <TextGenerateEffect
              words="Your plants deserve the best care. Track water needs, humidity requirements, and more with beautiful visualizations."
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            />
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg">
              <Link href="/plants">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-950/30 px-8 py-6 rounded-xl text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="animate-bounce"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-400"
            >
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Intelligent Plant Care
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            BloomBuddy helps you manage your plants with precision and care,
            providing insights through beautiful visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="rounded-[22px] p-4 sm:p-10 bg-black">
              <div className="flex flex-col items-center text-center h-full">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beautiful Data Visualization
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track your plants&apos; needs with intuitive charts and analytics
              that help you provide optimal care.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-3xl p-6 border border-purple-900/50 shadow-[0_0_50px_-12px] shadow-purple-500/30">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Button
                variant={activeTab === "water" ? "default" : "outline"}
                onClick={() => setActiveTab("water")}
                className={
                  activeTab === "water"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-500 text-purple-400"
                }
              >
                <LineChart className="mr-2 h-4 w-4" />
                Water Needs
              </Button>
              <Button
                variant={activeTab === "humidity" ? "default" : "outline"}
                onClick={() => setActiveTab("humidity")}
                className={
                  activeTab === "humidity"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-purple-500 text-purple-400"
                }
              >
                <BarChart className="mr-2 h-4 w-4" />
                Humidity Levels
              </Button>
            </div>

            <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-purple-800/30">
              {activeTab === "water" && (
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Water+Needs+Chart"
                  fill
                  alt="Water needs chart"
                  className="object-cover"
                />
              )}
              {activeTab === "humidity" && (
                <Image
                  src="/placeholder.svg?height=400&width=800&text=Humidity+Levels+Chart"
                  fill
                  alt="Humidity levels chart"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How BloomBuddy Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A simple process to keep your plants thriving with minimal effort
            </p>
          </div>
        </div>
      </section>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8"
      >
        Loved by Plant Enthusiasts
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-black/30 p-6 rounded-xl border border-purple-500/20"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <span className="font-bold">U{i}</span>
              </div>
              <div>
                <h4 className="font-medium">Plant Lover {i}</h4>
                <p className="text-sm text-gray-400">Plant Enthusiast</p>
              </div>
            </div>
            <p className="text-gray-300">
              &quot;BloomBuddy has completely transformed how I care for my
              plants. The visual charts make it so easy to understand each
              plant&apos;s needs!&quot;
            </p>
          </div>
        ))}
      </div>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Help Your Plants Thrive?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of plant lovers who use BloomBuddy to keep their
            green friends happy and healthy.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl text-lg">
            <Link href="/plants">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-700">
                BloomBuddy
              </h3>
              <p className="text-gray-400 mt-2">
                Your plants&apos; best friend
              </p>
            </div>

            <div className="flex gap-8">
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                About
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Features
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Pricing
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BloomBuddy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
