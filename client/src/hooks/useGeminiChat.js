import { useState, useEffect } from "react";
import { GoogleGenerativeAI, HarmCategory } from "@google/generative-ai";

const useGeminiChat = () => {
  const apiKey = "AIzaSyCZnZEtxX0HlpoH7sWZhNKo49dm06zzSn4";
  const [chatSession, setChatSession] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setError("Missing GEMINI_API_KEY environment variable");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        description:
          "Return ingredients, their quantities, brand, packet_size, NumberQuantity, and a summary for the requested recipe",
        properties: {
          recipe: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the recipe",
              },
              summary: {
                type: "string",
                description:
                  "A brief summary of the recipe or dish response and user input",
              },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    ingredient_name: {
                      type: "string",
                      description:
                        "Name of the ingredient, if not specified, provide a popular brand",
                    },
                    brand: {
                      type: "string",
                      description:
                        "Popular brand relating to the ingredient_name (e.g., Coca-Cola, Pepsi for soft drinks)",
                    },
                    quantity: {
                      type: "string",
                      description: "Quantity of the ingredient",
                    },
                    packet_size: {
                      type: "string",
                      description:
                        "Packet size available in the store (e.g., 500g, 1kg)",
                    },
                    NumberQuantity: {
                      type: "number",
                      description:
                        "Number of packets or items (e.g., 4 potatoes, 2 packs of Coca-Cola)",
                    },
                  },
                  required: [
                    "ingredient_name",
                    "brand",
                    "quantity",
                    "packet_size",
                    "NumberQuantity",
                  ],
                },
              },
            },
            required: ["name", "summary", "ingredients"], // All fields are required
          },
        },
        required: ["recipe"], // Recipe object itself is required
      },
    };

    const newChatSession = model.startChat({ generationConfig });
    setChatSession(newChatSession);

    try {
      if (newChatSession.safetySettings) {
        newChatSession.safetySettings.setBlacklistedCategory(
          HarmCategory.PERSONAL_ATTACK
        );
        newChatSession.safetySettings.setBlacklistedCategory(
          HarmCategory.HATE_SPEECH
        );
      } else {
        console.warn("Safety settings are not available.");
      }
    } catch (error) {
      setError(`Error setting safety settings: ${error.message}`);
    }
  }, [apiKey]);

  const sendMessage = async (userInput) => {
    if (!chatSession) {
      setError("Chat session not yet initialized");
      return;
    }

    setIsLoading(true);

    try {
      const promptMessage = `I want you to create a shopping cart based on my request. Here's my dish request: ${userInput}. If the number of people is not specified, make it for 1 person. Please provide a list of ingredients and quantities in JSON format. dont give the food order link always make sure give the ingredient of the food`;

      const result = await chatSession.sendMessage(promptMessage);
      console.log("API Response:", result.response);

      const responseText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedResponse = responseText ? JSON.parse(responseText) : null;

      setResponse(parsedResponse?.recipe);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, response, error, isLoading };
};

export default useGeminiChat;