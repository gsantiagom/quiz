// Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
	'Quiz',
    { pregunta: {
	    type: DataTypes.STRING,
	    validate: { notEmpty: {					msg: "-> Falta Pregunta"},
			        not: {args: ["Pregunta"],	msg: "-> Sustituya la palabra 'Pregunta'"}
			      }
      },
	  respuesta: {
	    type: DataTypes.STRING,
	    validate: { notEmpty: {					msg: "-> Falta Respuesta"},
			        not: {args: ["Respuesta"],	msg: "-> Sustituya la palabra 'Respuesta'"}
			      }
      }
    }
  );
}