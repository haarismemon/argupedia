let express = require('express');

let app = express()

const PORT = 3001
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
