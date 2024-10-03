// "use client";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/components/ui/use-toast";

// import { useRouter } from "next/navigation"; // Import useRouter for navigation
// import { useSession } from "next-auth/react";
// import React, { useEffect, useState } from "react";

// function UserDashboard() {
//   const { data: session } = useSession();
//   const { toast } = useToast();
//   const router = useRouter();

//   // Check if session is available
//   useEffect(() => {
//     if (!session || !session.user) {
//       // Optionally, you could redirect to a login page here
//       return;
//     }
//   }, [session]);

//   const handlePlay = (gameType: string) => {
//     router.push(`/play?type=${gameType}`); // Redirect to the game page with the type
//   };

//   if (!session || !session.user) {
//     return <div>Loading...</div>; // Consider a loading state or redirect to login
//   }

//   return (
//     <div className="relative my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">Play Game</h1>
//       <div className="flex flex-col gap-4">
//         {/* Game mode buttons */}
//         <Button onClick={() => handlePlay("quickplay")} variant="outline">
//           Quick Play
//         </Button>
//         <Button onClick={() => handlePlay("coupleplay")} variant="outline">
//           Couple Play
//         </Button>
//         <Button onClick={() => handlePlay("broplay")} variant="outline">
//           Bro Play
//         </Button>
//         <Button onClick={() => handlePlay("pokyplay")} variant="outline">
//           Pokie Play (girls Play)
//         </Button>
//       </div>
//       <Separator className="my-4" />
//     </div>
//   );
// }

// export default UserDashboard;

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

function UserDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  // Check if session is available
  useEffect(() => {
    if (!session || !session.user) {
      // Optionally, you could redirect to a login page here
      return;
    }
  }, [session]);

  const handlePlay = (gameType: string) => {
    router.push(`/play?type=${gameType}`); // Redirect to the game page with the type
  };

  if (!session || !session.user) {
    return <div>Loading...</div>; // Consider a loading state or redirect to login
  }

  return (
    <div className="relative my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Play Game</h1>
      <div className="flex flex-col gap-4">
        {/* Game mode buttons */}
        <Button
          onClick={() => handlePlay("quickplay")}
          variant="outline"
          className="bg-light-blue-200 text-blue-900  h-20 font-semibold hover:bg-light-blue-300 transition-all"
        >
          Quick Play
        </Button>
        <Button
          onClick={() => handlePlay("coupleplay")}
          variant="outline"
          className="bg-red-200 text-red-900 h-20 font-semibold hover:bg-red-300 transition-all"
        >
          Couple Play
        </Button>
        <Button
          onClick={() => handlePlay("broplay")}
          variant="outline"
          className="bg-green-200 text-green-900 h-20  font-semibold hover:bg-green-300 transition-all"
        >
          Bro Play
        </Button>
        <Button
          onClick={() => handlePlay("pokyplay")}
          variant="outline"
          className="bg-purple-200 text-purple-900 h-20  font-semibold hover:bg-purple-300 transition-all"
        >
          Pokie Play (Girls Play)
        </Button>
      </div>
      <Separator className="my-4" />
    </div>
  );
}

export default UserDashboard;
