"use client";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
export default function Footer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {};
  return (
    <footer className="border-t dark:bg-black">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2">
          <div className="border-b py-8 lg:order-last lg:border-b-0 lg:border-s lg:py-16 lg:ps-16">
            <div className="mt-8 space-y-4 lg:mt-0">
              <div>
                <h3 className="text-2xl font-medium flex items-center">
                  <Github className="mr-2 w-6 h-6" /> Proudly open-source
                </h3>
                <p className="mt-4 max-w-lg">
                  Our source code is available on GitHub - feel free to read,
                  review, or contribute to it however you want!
                </p>
              </div>
              <a
                href="https://github.com/umerarif01/zova"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button" className="w-full mt-6">
                  <Github className="mr-2 w-4 h-4" /> View on GitHub
                </Button>
              </a>
            </div>
          </div>
          <div className="py-8 lg:py-16 lg:pe-16">
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="font-medium ">Resources</p>

                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <a
                      href="#"
                      target="_blank"
                      className="transition hover:opacity-75"
                    >
                      {" "}
                      Terms & Conditions{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      target="_blank"
                      className="  transition hover:opacity-75"
                    >
                      {" "}
                      Privacy Policy{" "}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium ">Helpful Links</p>

                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <a
                      target="_blank"
                      href="/"
                      rel="noopener noreferrer"
                      className="  transition hover:opacity-75"
                    >
                      {" "}
                      Github{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t   pt-8">
              <ul className="flex flex-wrap gap-4 text-xs">
                <li>
                  <a
                    href="/"
                    target="_blank"
                    className="transition hover:opacity-75"
                  >
                    Terms & Conditions{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="/"
                    target="_blank"
                    className="transition hover:opacity-75"
                  >
                    Privacy Policy{" "}
                  </a>
                </li>
              </ul>

              <p className="mt-8 text-xs  ">
                &copy; 2024. Zova.chat. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
