export default function App() {
  const ws = new WebSocket("ws://localhost:8080");

  ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Hey, how is it going?");
  });

  return <div className="text-[32px] text-orange-500">Hello</div>;
}
