var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res) {
	models.Quiz.findAll({ include: [{model: models.Comment }] }).then(function(quizes) {
		var stats = {numCom: 0, pregSinCom: 0, pregConCom: 0, numComSinPub: 0};	// Variable contenedora de las estadísticas
		stats.numPreg = quizes.length;
		if (stats.numPreg > 0) {
			for (i=0; i < quizes.length; i++) {
				if (quizes[i].Comments.length > 0) {
					for (j=0; j < quizes[i].Comments.length; j++) {
						if (quizes[i].Comments[j].publicado) {
							stats.numCom ++;
						} else {
							stats.numComSinPub ++;
						}
					}
					stats.pregConCom++;
				} else {
					stats.pregSinCom++;
				}
			}
			stats.comPorPreg = stats.numCom / stats.numPreg;
		} else {
			stats.comPorPreg = 0;
		}

		res.render('quizes/statistics', { stats: stats, errors: []});
	}). catch(function(error) { next(error);})
}
