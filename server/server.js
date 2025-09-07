const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req,res)=> res.send('Cosmic Blueprint API running'));
app.listen(PORT, ()=> console.log(`Server on ${PORT}`));