import { useState, useRef } from "react";
import Head from "next/head";
import Script from "next/script";

export default function Spinner() {
  const bottleRef = useRef<HTMLElement | null>(null); // Explicitly type the ref
  const [spinning, setSpinning] = useState(false);

  const spinBottle = () => {
    if (spinning || !bottleRef.current) return; // Add null check here
    setSpinning(true);

    const randomDegree = Math.floor(Math.random() * 3600) + 360;
    bottleRef.current.style.transition = "transform 2s ease-out"; // Now it recognizes 'style'
    bottleRef.current.style.transform = `rotate(${randomDegree}deg)`;

    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Truth or Dare Bottle Spinner</title>
      </Head>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <model-viewer
          id="bottle"
          src="bottle/scene.gltf"
          alt="A 3D model of a bottle"
          camera-position="0m 1.5m 3m"
          ref={bottleRef}
          className="h-80 w-auto"
        ></model-viewer>
        <button
          className={`mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-transform duration-500 hover:scale-105 disabled:bg-gray-400`}
          onClick={spinBottle}
          disabled={spinning}
        >
          {spinning ? "Spinning..." : "Spin the Bottle"}
        </button>
      </div>
    </>
  );
}
