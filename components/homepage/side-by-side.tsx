import { Database, Globe } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { OrbitingCirclesComponent } from "./orbiting-circles";
import { TITLE_TAILWIND_CLASS } from "@/utils/constants";

const features = [
  {
    name: "Build and Deploy Tailored Chatbots.",
    description:
      "Easily create and deploy intelligent chatbots trained on your specific data sources such as PDFs, Word documents, and websites.",
    icon: FaRobot,
  },
  {
    name: "Leverage Your Data.",
    description:
      "Empower your chatbots to retrieve relevant information from diverse data formats, providing accurate and tailored insights.",
    icon: Database,
  },
  {
    name: "Scale Globally.",
    description:
      "Designed to grow with your needs. Scale your agents to handle increasing data and traffic without compromising performance.",
    icon: Globe,
  },
];

export default function SideBySide() {
  return (
    <div className="overflow-hidden ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p
                className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
              >
                Build and Deploy Tailored Data-Powered Chatbots
              </p>
              <p className="mt-6 leading-8 text-gray-600 dark:text-gray-400">
                Train your chatbots on any data source and deploy them for
                real-time, accurate insights.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold dark:text-gray-100 text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline dark:text-gray-400">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <OrbitingCirclesComponent />
        </div>
      </div>
    </div>
  );
}
