const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');
const {crearMensaje} = require('../utilidades/utilidades');
const usuarios = new Usuarios;

io.on('connection', (client) => {
  client.on('entrarChat', (data,callback) => {
    if (!data.nombre || !data.sala){
      return callback({
        err: true,
        message:'el nombre y sala son necesarios'
      });
    }
      client.join(data.sala);
      const personas = usuarios.agregarPersona(client.id,data.nombre,data.sala);
      client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasporSala(data.sala));
      client.broadcast.to(data.sala).emit('crearMensaje',crearMensaje('Administrador',`${data.nombre} ingresó al chat`));
      callback(usuarios.getPersonasporSala(data.sala));
  });
  client.on('crearMensaje', (data,callback)=> {
      const persona = usuarios.getPersona(client.id);
      const mensaje = crearMensaje(persona.nombre,data.mensaje);
      client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
      callback(mensaje);
  });
  client.on('disconnect',()=>{
    const personaBorrada = usuarios.borrarPersona(client.id);
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandonó el chat`));
    client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasporSala(personaBorrada.sala));
  }); 
  client.on('mensajePrivado', function(data) {
    const persona = usuarios.getPersona(client.id);
    const mensaje = crearMensaje(persona.nombre,data.mensaje);
    client.broadcast.to(data.para).emit('mensajePrivado',mensaje);
  });

  

});