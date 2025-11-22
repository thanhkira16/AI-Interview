import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./Experience";
import { Visualizer } from "./Visualizer";
import { DialoguePlayer } from "./DialoguePlayer";
import { TextToSpeech } from "./TextToSpeech";
import ChatInterview from "./ChatInterview";

const examples = [

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
        </div>

        {/* Content based on current hash */}
        {currentHash === "interview" ? (
          <ChatInterview />
        ) : (
          <ChatInterview />
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
