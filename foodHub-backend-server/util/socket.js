let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);

    io.on("connection", (socket)=>{
      socket.on("disconnect", (reason)=>{
        socket.disconnect();
      });
      socket.on("debug:hello", (mess)=>{
        console.log(`client ${socket.io} say ${mess}`);
      })

    });
    
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("socket.io is not initialized!");
    }
    return io;
  },
};
