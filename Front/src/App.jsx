export default function App() {
  const ws = new WebSocket("ws://localhost:8080");

  ws.addEventListener("open", () => {
    console.log("We are connected!");

    ws.send("Hey, how is it going?");
  });

  ws.addEventListener("message", ({ data }) => {
    console.log(data);
  });

  return (
    <section className="h-screen bg-slate-600 flex flex-col justify-center items-center">
      <img src="./logo.png" className="size-[120px]" />
      <div className="flex w-[40%] h-[60%]">
        <div className="w-[25%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
        <div className="w-[75%] bg-slate-700 ring-4 ring-slate-800 rounded-md">
          <div>Chat</div>
        </div>
      </div>
    </section>
  );
}
