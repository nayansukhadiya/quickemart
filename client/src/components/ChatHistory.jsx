import React, { useContext } from "react";
import HomeCard from "./HomeCard"; // Ensure this is needed
import UserContext from "../context/UserContext";
import useChatProduct from "../hooks/useChatProduct";
import "../style/ChatHistory.css";
import { Link } from "react-router-dom";

function ChatHistory() {
  const { chatArrPro, setChatArrPro } = useContext(UserContext);
  const { chatArray } = useContext(UserContext);
  const { filterPro, notPreArr } = useChatProduct(chatArray);

  console.log(chatArray);

  return (
    <div className="chatHistory">
      {chatArray.length === 0 ? (
        <p>No chat history available.</p>
      ) : (
        chatArray.map((item) => {
          if (item.author === "user") {
            return (
              <div className="userMessage Message" key={item.id}>
                {item.message}
              </div>
            );
          } else if (
            item.author === "admin" &&
            item.rapidRecipeArr.length > 0
          ) {
            return (
              <div className="adminMessage Message" key={item.id}>
                <div className="logoMessage">
                  <div className="logoChat">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                        <path
                          fill="currentColor"
                          d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="chatDetail">
                  <h3 className="cartTitle">
                    {item.rapidRecipeArr[0]?.recipe?.name}
                  </h3>
                  <p className="summary">
                    {item.rapidRecipeArr[0]?.summary}
                  
                  <ul className="ingredientsList">
                    {item.rapidRecipeArr[0]?.recipe?.ingredients?.map(
                      (ingredient, index) => (
                        <li key={index}>{ingredient.ingredient_name}</li> // Assuming `name` field exists in ingredient object
                      )
                    )}
                  </ul></p>
                  <div className="linkSec">
                    <Link to={`/cartgen?id=${item.cart_id}`}>
                      View Your Cart{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-square-arrow-out-up-right"
                      >
                        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                        <path d="m21 3-9 9" />
                        <path d="M15 3h6v6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })
      )}
    </div>
  );
}

export default ChatHistory;