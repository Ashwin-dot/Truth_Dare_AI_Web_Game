// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState, useRef, Suspense } from "react";
// import axios, { AxiosError } from "axios";
// import { useToast } from "@/components/ui/use-toast";
// import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { Mesh, Vector3 } from "three";
// import { useSession } from "next-auth/react";
// import { FaArrowLeft } from "react-icons/fa"; // Import left arrow icon from react-icons
// import { Html } from "@react-three/drei"; // Drei for loading fallback and HTML elements in 3D

// export default function PlayPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [category, setCategory] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [askForChoice, setAskForChoice] = useState(false);
//   const [result, setResult] = useState("");
//   const [suggestion, setSuggestion] = useState("");
//   const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false); // New state for loading prompt
//   const { toast } = useToast();
//   const bottleRef = useRef<Mesh | null>(null);
//   const [spinning, setSpinning] = useState(false);
//   const [spinDuration] = useState(3000);
//   const [targetRotation, setTargetRotation] = useState<Vector3 | null>(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const gameType = params.get("type");

//     if (!gameType) {
//       router.push("/");
//       return;
//     }

//     switch (gameType) {
//       case "quickplay":
//         setCategory("Mix Category");
//         break;
//       case "coupleplay":
//         setCategory("For Couples(two individual)");
//         break;
//       case "broplay":
//         setCategory("Group for Boys");
//         break;
//       case "pokyplay":
//         setCategory("Group for Girls");
//         break;
//       default:
//         setCategory("Unknown Category");
//     }
//     setLoading(false);
//   }, [router]);

//   const goBack = () => {
//     router.push("/dashboard");
//   };

//   // Mesh component for the 3D bottle model
//   function Bottle() {
//     const gltf = useLoader(GLTFLoader, "/bottle/scene.gltf");

//     useFrame(() => {
//       if (bottleRef.current && targetRotation) {
//         bottleRef.current.rotation.z +=
//           (targetRotation.z - bottleRef.current.rotation.z) * 0.1;
//       }
//     });

//     return (
//       <primitive
//         object={gltf.scene}
//         ref={bottleRef}
//         scale={8}
//         position={[0, 0, 0]}
//       />
//     );
//   }

//   const spinBottle = () => {
//     if (spinning || !bottleRef.current) return;

//     // Reset result and suggestion when spinning
//     setResult("");
//     setSuggestion("");

//     setSpinning(true);

//     const totalRotationDegrees = 3 * 360;
//     const randomXRotation = Math.floor(Math.random() * 1080);
//     const randomYRotation = Math.floor(Math.random() * 1080);
//     const randomZRotation = Math.floor(Math.random() * 1080);

//     const targetRotation = new Vector3(
//       (totalRotationDegrees + randomXRotation) * (Math.PI / 90),
//       (totalRotationDegrees + randomYRotation) * (Math.PI / 90),
//       (totalRotationDegrees + randomZRotation) * (Math.PI / 90)
//     );

//     setTargetRotation(targetRotation);

//     setTimeout(() => {
//       setSpinning(false);
//       setAskForChoice(true);
//     }, spinDuration);
//   };

//   const handleChoice = async (choice: string) => {
//     setAskForChoice(false);
//     setResult(choice);
//     setIsGeneratingPrompt(true); // Set loading state to true

//     if (!session || !session.user) {
//       toast({
//         title: "Error",
//         description: "Session not found. Please log in again.",
//         variant: "destructive",
//       });
//       setIsGeneratingPrompt(false); // Reset loading state
//       return;
//     }

//     try {
//       const response = await axios.post("/api/suggest-messages", {
//         type: choice,
//         category,
//       });

//       const newSuggestion = response.data.message;
//       setSuggestion(newSuggestion);
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       console.error("Error fetching suggestion:", axiosError);
//       const errorMessage =
//         axiosError.response?.data?.message || "Failed to fetch suggestion";
//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setIsGeneratingPrompt(false); // Reset loading state after the API call
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       {/* Back Button with Icon Only */}
//       <button onClick={goBack} className="mb-4">
//         <FaArrowLeft size={24} />
//       </button>

//       <h1 className="text-4xl font-bold mb-4">Play Mode: {category}</h1>

//       <div className="flex justify-center my-4">
//         <div className="flex flex-col items-center">
//           <Canvas
//             className="h-auto w-96"
//             style={{ height: "400px", width: "400px" }}
//             camera={{ position: [0, 0, 5], fov: 50 }}
//           >
//             <ambientLight />
//             <directionalLight position={[0, 10, 5]} intensity={1} />
//             <Suspense
//               fallback={
//                 <Html center>
//                   <div>Loading bottle...</div>
//                 </Html>
//               }
//             >
//               <Bottle />
//             </Suspense>
//           </Canvas>

//           <button
//             className={`mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-transform duration-500 hover:scale-105 disabled:bg-gray-400`}
//             onClick={spinBottle}
//             disabled={spinning}
//           >
//             {spinning ? "Spinning..." : "Spin the Bottle"}
//           </button>
//         </div>
//       </div>

//       {askForChoice && (
//         <div className="mt-4">
//           <p className="text-lg">Would you like to choose Truth or Dare</p>
//           <button
//             onClick={() => handleChoice("Truth")}
//             className="mt-2 p-2 bg-green-500 text-white rounded mr-2"
//           >
//             Truth
//           </button>
//           <button
//             onClick={() => handleChoice("Dare")}
//             className="mt-2 p-2 bg-red-500 text-white rounded"
//           >
//             Dare
//           </button>
//         </div>
//       )}

//       {result && (
//         <div className="mt-4 p-4 bg-gray-100 rounded">
//           <p className="text-lg font-semibold">You chose: {result}!</p>
//           {suggestion && <p className="mt-2">{suggestion}</p>}
//         </div>
//       )}
//       {isGeneratingPrompt && ( // Loading message while generating prompt
//         <div className="mt-4 p-4 bg-yellow-100 rounded">
//           <p className="text-lg">Generating Truth and Dare From AI...</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh, Vector3 } from "three";
import { useSession } from "next-auth/react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa"; // Added spinner icon
import { Html } from "@react-three/drei"; // Drei for loading fallback and HTML elements in 3D

export default function PlayPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [askForChoice, setAskForChoice] = useState(false);
  const [result, setResult] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false); // New state for loading prompt
  const { toast } = useToast();
  const bottleRef = useRef<Mesh | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinDuration] = useState(3000);
  const [targetRotation, setTargetRotation] = useState<Vector3 | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameType = params.get("type");

    if (!gameType) {
      router.push("/");
      return;
    }

    switch (gameType) {
      case "quickplay":
        setCategory("Mix Category");
        break;
      case "coupleplay":
        setCategory("For Couples (two individuals)");
        break;
      case "broplay":
        setCategory("Group for Boys");
        break;
      case "pokyplay":
        setCategory("Group for Girls");
        break;
      default:
        setCategory("Unknown Category");
    }
    setLoading(false);
  }, [router]);

  const goBack = () => {
    router.push("/dashboard");
  };

  // Mesh component for the 3D bottle model
  function Bottle() {
    const gltf = useLoader(GLTFLoader, "/bottle/scene.gltf");

    useFrame(() => {
      if (bottleRef.current && targetRotation) {
        bottleRef.current.rotation.z +=
          (targetRotation.z - bottleRef.current.rotation.z) * 0.1;
      }
    });

    return (
      <primitive
        object={gltf.scene}
        ref={bottleRef}
        scale={8}
        position={[0, 0, 0]}
      />
    );
  }

  const spinBottle = () => {
    if (spinning || !bottleRef.current) return;

    // Reset result and suggestion when spinning
    setResult("");
    setSuggestion("");

    setSpinning(true);

    const totalRotationDegrees = 3 * 360;
    const randomXRotation = Math.floor(Math.random() * 1080);
    const randomYRotation = Math.floor(Math.random() * 1080);
    const randomZRotation = Math.floor(Math.random() * 1080);

    const targetRotation = new Vector3(
      (totalRotationDegrees + randomXRotation) * (Math.PI / 90),
      (totalRotationDegrees + randomYRotation) * (Math.PI / 90),
      (totalRotationDegrees + randomZRotation) * (Math.PI / 90)
    );

    setTargetRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setAskForChoice(true);
    }, spinDuration);
  };

  const handleChoice = async (choice: string) => {
    setAskForChoice(false);
    setResult(choice);
    setIsGeneratingPrompt(true); // Set loading state to true

    if (!session || !session.user) {
      toast({
        title: "Error",
        description: "Session not found. Please log in again.",
        variant: "destructive",
      });
      setIsGeneratingPrompt(false); // Reset loading state
      return;
    }

    try {
      const response = await axios.post("/api/suggest-messages", {
        type: choice,
        category,
      });

      const newSuggestion = response.data.message;
      setSuggestion(newSuggestion);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching suggestion:", axiosError);
      const errorMessage =
        axiosError.response?.data?.message || "Failed to fetch suggestion";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPrompt(false); // Reset loading state after the API call
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      {/* Back Button with Icon Only */}
      <button onClick={goBack} className="mb-4">
        <FaArrowLeft size={24} />
      </button>

      <h1 className="text-4xl font-bold mb-4">Play Mode: {category}</h1>

      <div className="flex justify-center my-4">
        <div className="flex flex-col items-center">
          <Canvas
            className="h-auto w-96"
            style={{ height: "400px", width: "400px" }}
            camera={{ position: [0, 0, 5], fov: 50 }}
          >
            <ambientLight />
            <directionalLight position={[0, 10, 5]} intensity={1} />
            <Suspense
              fallback={
                <Html center>
                  <div>Loading bottle...</div>
                </Html>
              }
            >
              <Bottle />
            </Suspense>
          </Canvas>

          <button
            className={`mt-4 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-transform duration-500 hover:scale-105 disabled:bg-gray-400`}
            onClick={spinBottle}
            disabled={spinning}
          >
            {spinning ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" /> Spinning...
              </div>
            ) : (
              "Spin the Bottle"
            )}
          </button>
        </div>
      </div>

      {askForChoice && (
        <div className="mt-4">
          <p className="text-lg">Would you like to choose Truth or Dare?</p>
          <button
            onClick={() => handleChoice("Truth")}
            className="mt-2 p-2 bg-green-500 text-white rounded mr-2"
          >
            Truth
          </button>
          <button
            onClick={() => handleChoice("Dare")}
            className="mt-2 p-2 bg-red-500 text-white rounded"
          >
            Dare
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg font-semibold">You chose: {result}!</p>
          {suggestion && <p className="mt-2">{suggestion}</p>}
        </div>
      )}

      {isGeneratingPrompt && ( // Loading message while generating prompt
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <p className="text-lg">Generating Truth and Dare From AI...</p>
        </div>
      )}
    </div>
  );
}
