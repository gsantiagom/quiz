var models = require('../models/models.js');

// Autoload - factoriza el c�digo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{model: models.Comment }]
	  }).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else { next(new Error('No existe quizId=' + quizId)); }
	  }).catch(function(error) { next(error);}
	);
};

// GET /quizes
exports.index = function(req, res) {
	var where = {order: 'pregunta ASC'};	// Variable para pasar el filtro que pasaremos en findAll, inicializado a sin filtro pero con ordenaci�n ascendente.
	if (req.query.search) {	// Si existe el par�metro search, filtramos en la query por dicho par�metro.
		var filtro = "%" + req.query.search.replace(/\s/g, "%") + "%";	// Filtro exigido en el enunciado, incluyendo espacios intermedios.
		console.log(filtro);
		where.where = ["pregunta like ?", filtro];
	}
	models.Quiz.findAll(where).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes, errors: []});
	}). catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz, errors: []});
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
			{ quiz: req.quiz, respuesta: resultado,
			  errors: []});
	})
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
	  { pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
}

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(
		function(err){
		  if (err) {
			  res.render('quizes/new', {quiz: quiz, errors: err.errors});
		  } else {
			// save: guarda en DB los campos pregunta y respuesta de quiz
			quiz
			.save({fields: ["pregunta", "respuesta", "tematica"]})
			.then(function(){ res.redirect('/quizes')})
				// Redirecci�n HTTP (URL relativo) lista de preguntas
		  }
		}
    );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
}

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	req.quiz
	.validate()
	.then(
		function(err){
		  if (err) {
			  res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		  } else {			
			req.quiz // save: guarda campos pregunta y respuesta en DB
			.save({fields: ["pregunta", "respuesta", "tematica"]})
			.then(function(){ res.redirect('/quizes')})
				// Redirecci�n HTTP (URL relativo) lista de preguntas
		  }
		}
    );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

// GET /author
exports.author = function(req, res) {
	res.render('author', { errors: [] });
};