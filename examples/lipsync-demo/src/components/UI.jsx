import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Experience } from "./Experience";
import { Visualizer } from "./Visualizer";
import { DialoguePlayer } from "./DialoguePlayer";
import { TextToSpeech } from "./TextToSpeech";

const examples = [
  {
    label: "Visualizer",
    href: "#",
  },
  {
    label: "3D model",
    href: "#model",
  },
  {
    label: "Dialogues",
    href: "#dialogues",
  },
  {
    label: "Text-to-Speech",
    href: "#tts",
  },
];

export const UI = () => {
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.replace("#", "")
  );

  useEffect(() => {
    // When hash in the url changes, update the href state
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section className="flex flex-col-reverse lg:flex-row overflow-hidden h-full w-full">
      <div className="p-10 lg:max-w-2xl overflow-y-auto">
        <a
          className="pointer-events-auto select-none opacity-0 animate-fade-in-down animation-delay-200 "
          href="https://wawasensei.dev"
          target="_blank"
        >
          <img
            src="/images/wawasensei.png"
            alt="Wawa Sensei logo"
            className="w-20 h-20 object-contain"
          />
        </a>

        {/* Navigation tabs */}
        <div className="mb-6 opacity-0 animate-fade-in-down animation-delay-400">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {examples.map((example) => (
              <a
                key={example.href}
                href={example.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${currentHash === example.href.replace("#", "")
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {example.label}
              </a>
            ))}
          </div>

          {/* Dashboard Link */}
          <div className="mt-4 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Đi tới Dashboard
            </Link>
          </div>
        </div>

        {/* Content based on current hash */}
        {currentHash === "dialogues" ? (
          <DialoguePlayer />
        ) : currentHash === "tts" ? (
          <TextToSpeech />
        ) : (
          <Visualizer />
        )}
      </div>
      <div className="flex-1 bg-gradient-to-b from-pink-400 to-pink-200 relative">
        <Canvas shadows camera={{ position: [12, 8, 26], fov: 30 }}>
          <Suspense>
            <Experience />
          </Suspense>
        </Canvas>
        <div className="bg-gradient-to-b from-transparent to-black/90 absolute bottom-0 top-3/4 left-0 right-0 pointer-events-none z-10">
          <div className="bottom-4 fixed z-20 right-4 md:right-15 flex items-center gap-4 animation-delay-1500 animate-fade-in-up opacity-0 ">
            <div className="w-20 h-px bg-white/60"></div>
            <a
              href="https://lessons.wawasensei.dev/courses/react-three-fiber/"
              className="text-white/60 text-xs pointer-events-auto select-none"
            >
              Learn Three.js & React Three Fiber
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
