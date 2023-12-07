import React, { useEffect, useState } from "react";
import Header from "./Header";
import Search from "./Search";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

const testUser = { username: "Duane" };

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update the URL to match your Flask API endpoint
    fetch("http://127.0.0.1:5555/messages")
      .then((r) => {
        // Check for a successful response (status code 200: OK)
        if (r.ok) {
          return r.json();
        }
        // Throw an error for non-OK responses
        throw new Error("Failed to fetch messages");
      })
      .then((messages) => {
        setMessages(messages);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        // Handle errors from fetch
        console.error(error.message);
        setMessages([]); // Clear messages on error
        setError(error.message);
      });
  }, []);

  function handleAddMessage(newMessage) {
    setMessages([...messages, newMessage]);
  }

  function handleDeleteMessage(id) {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  }

  function handleUpdateMessage(updatedMessageObj) {
    const updatedMessages = messages.map((message) => {
      if (message.id === updatedMessageObj.id) {
        return updatedMessageObj;
      } else {
        return message;
      }
    });
    setMessages(updatedMessages);
  }

  const displayedMessages = messages.filter((message) =>
    message.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={isDarkMode ? "dark-mode" : ""}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />
      <Search search={search} onSearchChange={setSearch} />
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <MessageList
          messages={displayedMessages}
          currentUser={testUser}
          onMessageDelete={handleDeleteMessage}
          onUpdateMessage={handleUpdateMessage}
        />
      )}
      <NewMessage currentUser={testUser} onAddMessage={handleAddMessage} />
    </main>
  );
}

export default App;

