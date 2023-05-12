const express = require('express');
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`listening on port:${PORT}`))

module.exports = app;