const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./../swagger.json');

// require local modules
const { quotes } = require('./data.js');
const { getRandomElement } = require('./utils.js');

// App setup
const app = express();

/**
 * MIDDLEWARES
 */

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Morgan
app.use(morgan('dev'));

// static pages
app.use(express.static('public'));

/**
 *  ROUTES
 */
// random quote

app.get('/api/quotes/random', (req, res) => {
	const randomQuote = getRandomElement(quotes);
	res.send({
		quote: [randomQuote],
	});
});

// all quotes array and filter by name
app.get('/api/quotes', (req, res) => {
	if (req.query.person !== undefined) {
		const quotesByPerson = quotes.filter(
			(quote) => quote.person === req.query.person
		);
		res.send({
			quotes: quotesByPerson,
		});
	} else {
		res.send({
			quotes: quotes,
		});
	}
});

// post a new quote
app.post('/api/quotes', (req, res) => {
	const quote = req.query.quote;
	const quoteBy = req.query.person;

	if (!quote && !quoteBy) {
		res.status(404).send('Missing data');
	} else {
		const newQuote = {
			quote: quote,
			person: quoteBy,
		};

		quotes.push(newQuote);
		res.send({ quote: newQuote });
	}
});

/**
 * SERVER LISTENING AT PORT 5000
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listenting at PORT: ${PORT}`));
