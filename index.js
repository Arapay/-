var socket=io();
socket.on('news',data=>{
    console.log(data);
})