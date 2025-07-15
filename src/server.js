//The address of this server connected to the network is:
// URL -> http://localhost:8000
//IP ->127.0.0.1:8000 

import express from 'express'

const app=express()
const PORT=process.env.PORT ||5000


app.listen(PORT,()=>console.log(`Server has started on: ${PORT}`))
