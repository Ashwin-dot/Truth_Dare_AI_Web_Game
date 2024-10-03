import { useEffect, useState } from "react";
import axios from "axios";

const Chat = () => {
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const getResponse = async () => {
      try {
        const res = await axios.post("/api/chat");
        setResponse(res.data.message);
      } catch (error) {
        console.error("Error fetching response:", error);
        setResponse("An error occurred while generating the response.");
      }
    };

    // Trigger API call on component mount
    getResponse();
  }, []);

  return (
    <div>
      <h2>AI21 Generated Response</h2>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          height: "200px",
          overflowY: "auto",
        }}
      >
        {response ? response : "Generating response..."}
      </div>
    </div>
  );
};

export default Chat;
