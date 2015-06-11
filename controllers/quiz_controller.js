var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else { next(new Error('No existe quizId=' + quizId)); }
	}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	var where = {order: 'pregunta ASC'};	// Variable para pasar el filtro que pasaremos en findAll, inicializado a sin filtro pero con ordenación ascendente.
	if (req.query.search) {	// Si existe el parámetro search, filtramos en la query por dicho parámetro.
		var filtro = "%" + req.query.search.replace(/\s/g, "%") + "%";	// Filtro exigido en el enunciado, incluyendo espacios intermedios.
		console.log(filtro);
		where.where = ["pregunta like ?", filtro];
	}
	models.Quiz.findAll(where).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes});
	}). catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render('quizes/answer',
			{ quiz: req.quiz, respuesta: resultado});
	})
};

// GET /author
exports.author = function(req, res) {
	res.render('author', {});
};