export const updateContentLayer = async ({ server, refreshContent }) => {
  server.middlewares.use("/_refresh", async (req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }
    let body = [];
    req.on("data", (chunk) => body.push(chunk));
    req.on("end", async () => {
      try {
        const story = JSON.parse(Buffer.concat(body).toString());
        await refreshContent?.({
          context: { story },
          loaders: ["story-loader"],
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Content refreshed successfully",
          })
        );
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: `Failed to refresh content: ${error.message}`,
          })
        );
      }
    });
  });
};
