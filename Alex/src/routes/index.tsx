import { createFileRoute } from "@tanstack/react-router";
import { ChatContainer } from "~/components/Chat/ChatContainer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        <ChatContainer />
      </div>
    </div>
  );
}
