import express from 'express'
import { Server } from 'socket.io';

import http from 'http'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();
//to run socket.io we need to have http server
const server=http.createServer(app);


const io=new Server(server);
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname, "public")));

io.on("connection",function(socket){
    console.log("connected");

    //accept locationn that is beingg emit 
    socket.on("send-location", function(data) {
    console.log("Received location from", socket.id, ":", data); // ✅ Add this
    io.emit("receive-location", { id: socket.id, ...data });
});

    socket.on("disconnected",function(){
        io.emit("user-disconnected",socket.id);
    })
})
app.get('/',(req,res)=>{
    res.render("index")
})

const port = process.env.PORT || 1000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});