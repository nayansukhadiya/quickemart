import React, { useState, useRef, useEffect, useContext } from "react";
import "./chatBox.css";
import useGeminiChat from "../../hooks/useGeminiChat";
import UserContext from "../../context/UserContext";
import useChatProduct from "../../hooks/useChatProduct";

function ChatBot({ chatPrompt }) {
  const { chatArray, setChatArray } = useContext(UserContext);
  const { setAnsGet, setChatLoad } = useContext(UserContext);
  const [prompt, setPrompt] = useState("");
  const [foodPmt, setFoodPmt] = useState(null);
  const [rapidRecipeArr, setRapidRecipeArr] = useState([]);
  const [userCartMessage, setUserCartMessage] = useState(null);
  const [foodStyleBtn, setFoodStyleBtn] = useState("veg");
  const [foodBtnOpen, setFoodBtnOpen] = useState(false);
  const inputRef = useRef(null);
  const foodStyle = ["veg", "nonVeg", "vegan"];
  useEffect(() => {
    setFoodPmt(foodStyleBtn);
  }, [foodStyleBtn]);

  const { filterPro } = useChatProduct(chatArray);
  const { sendMessage, isLoading, error, response } = useGeminiChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() === "") return;
    setAnsGet(true);
    setChatLoad(true);
    const promptMessage = `I want you to create a shopping cart based on my request. Here's my dish request to how to cook and give me required every minor single ingredient of every single dish: ${prompt}. And food style is must be ${foodPmt}. Please provide a list of ingredients and quantities in JSON format.`;

    try {
      setPrompt("");
      setChatArray((prev) => [...prev, { author: "user", message: prompt }]);
      await sendMessage(promptMessage);
      setChatLoad(false);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    if (response) {
      const newRecipe = {
        recipe: {
          name: response.name,
          ingredients: response.ingredients,
        },
        summary: response.summary,
        userMessageDetail: response.userMessageDetail,
      };

      setRapidRecipeArr([newRecipe]);
      setUserCartMessage(response.userMessageDetail);
    } else {
      setRapidRecipeArr([]);
    }
  }, [response]);

  useEffect(() => {
    if (rapidRecipeArr.length > 0) {
      const newIndex = chatArray.length;
      const newEntry = {
        cart_id: generateUniqueIdWithIndex(newIndex),
        author: "admin",
        useChatProduct: userCartMessage,
        rapidRecipeArr: rapidRecipeArr,
      };

      // Update chat array and filter products
      setChatArray((prev) => {
        const updatedChatArray = [...prev, newEntry];
        filterPro([newEntry]); // Call filterPro with the new entry
        return updatedChatArray; // Return the updated array
      });

      console.log("response is ", rapidRecipeArr);
    }
  }, [rapidRecipeArr]);

  const generateUniqueIdWithIndex = (index) => {
    return `Rapid.nayan.dev-${Date.now()}-${index}`;
  };

  useEffect(() => {
    if (chatPrompt) {
      setPrompt(chatPrompt);
    }
  }, [chatPrompt]);

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current;
      textarea.style.height = "40px";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflow = "auto";
    }
  }, [prompt]);

  return (
    <div className="chatBox">
      <form onSubmit={handleSubmit} className="chatBoxForm">
        <textarea
          className="chatBoxInput"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          disabled={isLoading}
          placeholder="Type Your Prompt..."
        />
      </form>
      {error && <div className="error">{error}</div>}
      <div className="ChatBotBottomSec">
        <div className="FoodStyleCardSec">
          {foodBtnOpen &&
            foodStyle.map((item) => (
              <button
                key={item}
                onClick={() => {setFoodStyleBtn(item)
                  setFoodBtnOpen(false);
                }}
                className={`${item} ${foodStyleBtn === item ? "active" : ""}`}
              >
                {item
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </button>
            ))}
        </div>
        <button className="ChangeStyle" onClick={() => setFoodBtnOpen(prev => !prev)}>
          {foodStyleBtn
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
          <svg className={`${foodBtnOpen ? "BtnSvgFlip" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          aria-label="Send Message"
          onClick={handleSubmit}
          className={`btn-grad ${isLoading ? "loadingChatBtn" : ""}`}
        >
         Generate
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
