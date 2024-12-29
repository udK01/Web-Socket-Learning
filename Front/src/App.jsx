export default function App() {
  const ws = new WebSocket("ws://localhost:8080");

  ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Hey, how is it going?");
  });

  ws.addEventListener("message", ({ data }) => {
    console.log(data);
  });

  return <div className="text-[32px] text-orange-500">Hello</div>;
}
