var params = new URLSearchParams(window.location.search);
if (!params.has('nombre') || !params.has('sala')) {
  window.location = 'index.html';
  throw new Error('El nombre y sala son necesarios');
}
const nombre=  params.get('nombre');
const sala=  params.get('sala');
//referencias jquery
const  divUsuarios = $("#divUsuarios");
const formEnviar = $("#formEnviar");
const txtMensaje = $("#txtMensaje");
const divChatbox = $("#divChatbox");
//funciones para renderizar usuario
function renderizarUsuarios(personas){
  var html ='';
  html +='<li>';
  html +='<a href="javascript:void(0)" class="active"> Chat de <span> '+sala+'</span></a>';
  html +='</li>';
  for (var i =0;i<personas.length;i++){
    html +='<li>';
    html +='<a href="javascript:void(0)" data-id="'+personas[i].id+'"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+' <small class="text-success">online</small></span></a>';
    html +='</li>';
  }
  html +='<li class="p-20"></li>';
  divUsuarios.html(html);
}

//listerner
divUsuarios.on('click','a',function(){
  const id = $(this).data('id');
  if (id){
    console.log(id);
  }  
});
formEnviar.on('submit',function(e){
  e.preventDefault();
  if ($.trim(txtMensaje.val()).length === 0){
    return false;
  }else{
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: $.trim(txtMensaje.val())
    }, function(mensaje) {  
        txtMensaje.val('').focus();     
        renderizarMensajes(mensaje,true);
    });
    
  }  
});
function renderizarMensajes(mensaje,yo){
  var html = '';
  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours()+':'+fecha.getMinutes();
  var adminClass= 'info';
  if (mensaje.nombre === 'Administrador'){
    adminClass = 'danger';
  }
  if (yo){
    html +='<li class="reverse animated fadeIn">';
    html +='<div class="chat-content">';
    html +='<h5>'+mensaje.nombre+'</h5>';
    html +='<div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
    html +='</div>';
    html +='<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
    html +='<div class="chat-time">'+hora+'</div>';
    html +='</li>';   
  }else{
    html +='<li class="animated fadeIn">';
    if (mensaje.nombre != 'Administrador'){
      html +='<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }
    html +='<div class="chat-content">';
    html +='<h5>'+mensaje.nombre+'</h5>';
    html +='<div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
    html +='</div>';
    html +='<div class="chat-time">'+hora+'</div>';
    html +='</li>';
  }
  divChatbox.append(html);
  scrollBottom();
}
function scrollBottom() {

  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      divChatbox.scrollTop(scrollHeight);
  }
}