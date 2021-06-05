/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntaActualizada = new Evento(this);
  this.preguntasEliminadas = new Evento(this);
  this.sumarVoto = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
     var max = -1;
       for (var i=0; i < this.preguntas.length; i++) {
         if (this.preguntas[i].id > max)
           max = this.preguntas[i].id;
       }
       return max;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar(); 
  },
  
  borrarPregunta: function(id) {
    var i = 0;
    var preguntaABorrar;
    var noEncontro = true;
    while (i < this.preguntas.length && noEncontro) {
      if (this.preguntas[i].id === id) {
        preguntaABorrar = i;
        noEncontro = false;
      }
      i++;
    }

   if (preguntaABorrar != undefined) {
      this.preguntas.splice(preguntaABorrar,1);
      this.guardar();
      this.preguntaEliminada.notificar();
    }
  },

  borrarTodo: function() {
    this.preguntas = [];
    this.guardar();
   // localStorage.clear();
    this.preguntasEliminadas.notificar(); 
  },

  actualizarPregunta: function(id, nuevaPregunta) {
    var i = 0;
    var preguntaAModificar;
    var encontro = false;
    while (i < this.preguntas.length && !encontro) {
      if (this.preguntas[i].id === id) {
        preguntaAModificar = i;
        encontro = true;
      }
      i++;
    }
    this.preguntas[preguntaAModificar].textoPregunta = nuevaPregunta;
    this.guardar();
    this.preguntaActualizada.notificar();
    
  },
  
  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem('preguntasGuardadas', JSON.stringify(this.preguntas));
  },

  cargar: function(){
    var stringPreguntas = localStorage.getItem('preguntasGuardadas');
    if (stringPreguntas == null)
      localStorage.setItem('preguntasGuardadas',"");
    else
      this.preguntas = JSON.parse(stringPreguntas);  
  },

  agregarVoto: function(pregunta, respuesta) {
    for(var i=0; i<this.preguntas.cantidadPorRespuesta.length; i++) {
      if (pregunta.cantidadPorRespuesta[i].textoPregunta === respuesta) {
        var iPregunta = -1;
        for(var j=0; j<this.preguntas.length; j++) {
          if(this.preguntas[j].textoPregunta === pregunta.textoPregunta)
            iPregunta = j;
        }; 
        pregunta.cantidadPorRespuesta[i].cantidad += 1;
        this.preguntas.splice(iPregunta, 1, pregunta);     
      }; 
    }; 
    this.guardar();
    this.sumarVoto.notificar(); 
  }

};
