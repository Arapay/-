var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
const users=[];
app.use(require('express').static(path.join(__dirname)))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
  
})

io.on('connection', function(socket) {
  socket.on('login', function(data) {
    let user=users.find(item=>item.username===data.username)
    if(user){
     socket.emit('fail_login','登录失败，用户已登录')
      
    }else{
      users.push(data)
      
      socket.emit('success_login',data.username)

      io.emit('adduser',data.username)
      io.emit('userlist',users)

      socket.username = data.username
    }
  })

  socket.on('disconnect',()=>{
    let idx = users.findIndex(item=>item.username===socket.username)
   
    if(idx>=0){users.splice(idx, 1)}
    io.emit('delete',socket.username)
    
    io.emit('userlist',users)
  })
  socket.on('send_msg',msg=>{
    console.log(msg)
    io.emit('get_msg',msg)
  })
})


http.listen(8002, function() {
  console.log('listen on 8002')
})
