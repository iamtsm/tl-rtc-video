/**
 * 封装socket连接公共方法
 */
class SocketHandler {
    constructor(sockets,socket){
        this.sockets = sockets;
        this.socket = socket;
    }


    /**
     * 链接断开
     * @param {*} message 
     * @param {*} params 
     */
    _disconnect(message, params){
        let socketId = this.socket.id;
        let data = {
          from : socketId,
        };
        this.socket.broadcast.emit('exit',data);
    }

    /**
     * 创建并加入
     * @param {*} message 
     * @param {*} params 
     */
    _createAndJoin(message, params){
        let room = message.room;

        let clientsInRoom = this.sockets.adapter.rooms[room];
        let numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

        if (numClients === 0) {
            this.socket.join(room);
            let createdData = {
                id: this.socket.id,
                room: room,
                peers: [],
            };
            Object.assign(createdData,params['created'])
            this.socket.emit('created', createdData);

        }else {
            let joinedData = {
                id: this.socket.id,
                room: room,
            };
            Object.assign(joinedData,params['joined'])
            this.sockets.in(room).emit('joined',joinedData);

            let peers = new Array();
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                peers.push({
                    id: otherSocketIds[i]
                });
            }

            this.socket.join(room);
            
            let createdData = {
                id: this.socket.id,
                room: room,
                peers: peers,
            };
            Object.assign(createdData,params['created'])
            this.socket.emit('created', createdData);
        }
    }


    /**
     * 【offer】转发offer消息至room其他客户端 [from,to,room,sdp]
     * @param {*} message 
     * @param {*} params 
     */
    _offer(message, params){
        let otherClient = this.sockets.connected[message.to];
        if (!otherClient) {
            return;
        }
        otherClient.emit('offer', message);
    }



    /**
     * 【answer】转发answer消息至room其他客户端 [from,to,room,sdp]
     * @param {*} message 
     * @param {*} params 
     */
    _answer(message, params){
        let otherClient = this.sockets.connected[message.to];
        if (!otherClient) {
            return;
        }
        otherClient.emit('answer', message);
    }



    /**
     * 【candidate】转发candidate消息至room其他客户端 [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
     * @param {*} message 
     * @param {*} params 
     */
    _candidate(message, params){
      let otherClient = this.sockets.connected[message.to];
      if (!otherClient){
          return;
      }
      otherClient.emit('candidate', message);
    }



    /**
     * 【exit】关闭连接转发exit消息至room其他客户端 [from,room]
     * @param {*} message 
     * @param {*} params 
     */
    _exit(message, params){
        let room = message.room;
  
        this.socket.leave(room);
        let clientsInRoom = this.sockets.adapter.rooms[room];
        if (clientsInRoom) {
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                let otherSocket = this.sockets.connected[otherSocketIds[i]];
                otherSocket.emit('exit', message);
            }
        }
    }


    _message(message){
        let room = message.room;
        let emitType = message.emitType;
        let from = message.from;
        let to = message.to;
        let clientsInRoom = this.sockets.adapter.rooms[room];
        if (clientsInRoom) {
            let otherSocketIds = Object.keys(clientsInRoom.sockets);
            for (let i = 0; i < otherSocketIds.length; i++) {
                let otherSocket = this.sockets.connected[otherSocketIds[i]];
                if(to && to === otherSocket.id){ //有指定发送id，不用走广播
                    otherSocket.emit(emitType, message);
                    return;
                }
                if(from != otherSocket.id ){
                    otherSocket.emit(emitType, message);
                }
            }
        }
    }
}

module.exports = {
    SocketHandler : SocketHandler
}