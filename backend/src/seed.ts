import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database";
import { Quiz } from "./models/Quiz";
import { Question } from "./models/Question";

const quizzes = [
	{
		title: "JavaScript Beginner Basics",
		slug: "javascript-beginner-basics",
		description:
			"A quick introduction to variables, functions, and JavaScript basics.",
		category: "Programming",
		difficulty: "Beginner" as const,
		durationMinutes: 5,
		featured: true,
		questions: [
			{
				questionText: "Which keyword declares a block-scoped variable?",
				options: ["var", "let", "static", "define"],
				correctAnswer: 1,
				explanation: "let declares a block-scoped variable.",
				points: 10,
			},
			{
				questionText:
					"Which symbol starts a JavaScript single-line comment?",
				options: ["<!--", "//", "##", "/*"],
				correctAnswer: 1,
				explanation: "JavaScript uses // for single-line comments.",
				points: 10,
			},
			{
				questionText: "Which method adds an item to the end of an array?",
				options: ["push()", "pop()", "shift()", "slice()"],
				correctAnswer: 0,
				explanation: "push() appends an item to the end of an array.",
				points: 10,
			},
		],
	},
	{
		title: "Intermediate Web Knowledge",
		slug: "intermediate-web-knowledge",
		description:
			"Test practical knowledge of JavaScript, React, APIs, and responsive web development.",
		category: "Technology",
		difficulty: "Intermediate" as const,
		durationMinutes: 12,
		featured: true,
		questions: [
			{
				questionText: "What does Array.prototype.map() return?",
				options: ["A boolean", "A new array", "A string", "A number"],
				correctAnswer: 1,
				explanation:
					"map returns a new array containing the callback results.",
				points: 10,
			},
			{
				questionText: "Which React Hook manages local component state?",
				options: ["useEffect", "useState", "useRef", "useMemo"],
				correctAnswer: 1,
				explanation: "useState stores and updates local component state.",
				points: 10,
			},
			{
				questionText: "Which HTTP method is normally used to create a resource?",
				options: ["GET", "POST", "HEAD", "OPTIONS"],
				correctAnswer: 1,
				explanation: "POST commonly creates a new resource.",
				points: 10,
			},
			{
				questionText: "Which CSS property creates a flexible layout?",
				options: [
					"position",
					"display: grid",
					"display: flex",
					"float",
				],
				correctAnswer: 2,
				explanation:
					"display: flex enables a one-dimensional flexible layout.",
				points: 10,
			},
			{
				questionText:
					"Which status code means an HTTP resource was not found?",
				options: ["200", "301", "404", "500"],
				correctAnswer: 2,
				explanation: "404 indicates that the requested resource was not found.",
				points: 10,
			},
			{
				questionText: "What does JSON stand for?",
				options: [
					"Java Simple Object Notation",
					"JavaScript Object Notation",
					"Joined Server Object Network",
					"JavaScript Ordered Numbers",
				],
				correctAnswer: 1,
				explanation: "JSON means JavaScript Object Notation.",
				points: 10,
			},
			{
				questionText:
					"Which operator performs strict equality in JavaScript?",
				options: ["==", "=", "===", "!==="],
				correctAnswer: 2,
				explanation:
					"=== compares both value and type without coercion.",
				points: 10,
			},
			{
				questionText: "What does npm primarily manage?",
				options: [
					"Databases",
					"Node.js packages",
					"Browsers",
					"Domain names",
				],
				correctAnswer: 1,
				explanation: "npm manages JavaScript packages and dependencies.",
				points: 10,
			},
			{
				questionText:
					"Which response header is commonly used for CORS?",
				options: [
					"Cache-Control",
					"Access-Control-Allow-Origin",
					"Content-Length",
					"Accept-Encoding",
				],
				correctAnswer: 1,
				explanation:
					"Access-Control-Allow-Origin controls cross-origin browser access.",
				points: 10,
			},
			{
				questionText:
					"Which HTML element represents primary page navigation?",
				options: ["<menu>", "<nav>", "<aside>", "<section>"],
				correctAnswer: 1,
				explanation: "The <nav> element represents a set of navigation links.",
				points: 10,
			},
		],
	},
	{
		title: "Advanced Full-Stack Challenge",
		slug: "advanced-full-stack-challenge",
		description:
			"A demanding quiz covering architecture, security, databases, TypeScript, and system design.",
		category: "Technology",
		difficulty: "Advanced" as const,
		durationMinutes: 18,
		featured: true,
		questions: [
			{
				questionText:
					"Which MongoDB feature provides atomic multi-document operations?",
				options: ["Aggregation", "Transactions", "Indexes", "Sharding"],
				correctAnswer: 1,
				explanation:
					"Transactions provide atomic multi-document operations in supported deployments.",
				points: 10,
			},
			{
				questionText: "Why should passwords not be stored as plaintext?",
				options: [
					"It increases bundle size",
					"It exposes credentials after a database breach",
					"It changes HTTP status codes",
					"It disables cookies",
				],
				correctAnswer: 1,
				explanation:
					"Password hashes protect credentials if stored data is compromised.",
				points: 10,
			},
			{
				questionText: "What is the purpose of an HTTP-only cookie?",
				options: [
					"Make cookies readable by JavaScript",
					"Prevent client-side JavaScript from reading the cookie",
					"Disable HTTPS",
					"Compress cookie data",
				],
				correctAnswer: 1,
				explanation:
					"HTTP-only cookies cannot be read by client-side JavaScript.",
				points: 10,
			},
			{
				questionText:
					"Which JWT section contains claims such as subject and expiry?",
				options: ["Header", "Payload", "Signature", "Salt"],
				correctAnswer: 1,
				explanation: "The payload contains JWT claims.",
				points: 10,
			},
			{
				questionText:
					"Which Mongoose concept defines data structure and validation?",
				options: ["Schema", "Router", "Middleware only", "Cookie"],
				correctAnswer: 0,
				explanation: "A Mongoose schema defines document structure and behavior.",
				points: 10,
			},
			{
				questionText:
					"What does database normalization primarily reduce?",
				options: ["Network latency", "Data redundancy", "Request headers", "TypeScript errors"],
				correctAnswer: 1,
				explanation: "Normalization reduces duplicate or redundant data.",
				points: 10,
			},
			{
				questionText:
					"Which practice prevents cross-site scripting by the browser?",
				options: [
					"Output encoding",
					"Bigger JavaScript bundles",
					"Using only GET",
					"Disabling TLS",
				],
				correctAnswer: 0,
				explanation:
					"Encoding untrusted output prevents injected script execution.",
				points: 10,
			},
			{
				questionText: "What is the main goal of clean architecture?",
				options: [
					"Remove all dependencies",
					"Separate business rules from external frameworks",
					"Avoid database access",
					"Put UI code in models",
				],
				correctAnswer: 1,
				explanation:
					"Clean architecture isolates business rules and framework details.",
				points: 10,
			},
			{
				questionText:
					"Which pattern prevents an API's callers from depending on a database implementation?",
				options: ["Repository", "Singleton CSS", "Inline query", "Global state"],
				correctAnswer: 0,
				explanation:
					"Repositories abstract persistence operations behind a stable interface.",
				points: 10,
			},
			{
				questionText:
					"Which HTTP header is used to negotiate JSON or HTML representation?",
				options: ["Accept", "Origin", "Referer", "Location"],
				correctAnswer: 0,
				explanation: "Accept tells a server which media type the client prefers.",
				points: 10,
			},
			{
				questionText:
					"What does TypeScript's unknown type require before use?",
				options: ["Immediate casting", "Runtime or type narrowing", "A database", "A browser reload"],
				correctAnswer: 1,
				explanation:
					"unknown values must be narrowed or validated before use.",
				points: 10,
			},
			{
				questionText:
					"Which Express middleware stage should centralize errors?",
				options: ["First middleware", "Final error-handling middleware", "Static assets", "Cookie parser"],
				correctAnswer: 1,
				explanation:
					"A final error middleware converts application failures into responses.",
				points: 10,
			},
			{
				questionText: "What is an idempotent API operation?",
				options: [
					"Always creates duplicates",
					"Repeating it has the same intended effect",
					"Only works once",
					"Returns HTML only",
				],
				correctAnswer: 1,
				explanation:
					"An idempotent operation produces the same intended result when repeated.",
				points: 10,
			},
			{
				questionText:
					"Which mechanism commonly limits brute-force login attempts?",
				options: ["Rate limiting", "CSS animation", "DNS caching", "Image optimization"],
				correctAnswer: 0,
				explanation:
					"Rate limiting restricts repeated requests over a time window.",
				points: 10,
			},
			{
				questionText: "What is a database index primarily used for?",
				options: [
					"Encrypting records",
					"Speeding up matching and sorting",
					"Replacing primary keys",
					"Compressing HTTP responses",
				],
				correctAnswer: 1,
				explanation: "Indexes speed common lookups and ordering operations.",
				points: 10,
			},
		],
	},
	{
		title: "World Geography Quiz",
		slug: "world-geography-quiz",
		description:
			"Explore continents, oceans, landmarks, and the countries of the world.",
		category: "General Knowledge",
		difficulty: "Beginner" as const,
		durationMinutes: 7,
		featured: false,
		questions: [
			{
				questionText: "Which is the largest ocean on Earth?",
				options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
				correctAnswer: 2,
				explanation: "The Pacific Ocean is the largest and deepest ocean.",
				points: 10,
			},
			{
				questionText: "Which continent is home to the Sahara Desert?",
				options: ["Asia", "Africa", "South America", "Australia"],
				correctAnswer: 1,
				explanation: "The Sahara stretches across much of northern Africa.",
				points: 10,
			},
			{
				questionText: "What is the capital city of Japan?",
				options: ["Seoul", "Beijing", "Bangkok", "Tokyo"],
				correctAnswer: 3,
				explanation: "Tokyo is the capital and largest city of Japan.",
				points: 10,
			},
			{
				questionText: "Which river flows through Egypt?",
				options: ["Amazon", "Danube", "Nile", "Yangtze"],
				correctAnswer: 2,
				explanation: "The Nile flows north through Egypt to the Mediterranean Sea.",
				points: 10,
			},
			{
				questionText: "Mount Everest is part of which mountain range?",
				options: ["Andes", "Alps", "Rockies", "Himalayas"],
				correctAnswer: 3,
				explanation: "Mount Everest is located in the Himalayas.",
				points: 10,
			},
		],
	},
	{
		title: "Science Foundations",
		slug: "science-foundations",
		description:
			"Test your understanding of biology, chemistry, physics, and our planet.",
		category: "Science",
		difficulty: "Intermediate" as const,
		durationMinutes: 8,
		featured: false,
		questions: [
			{
				questionText: "Which gas do plants absorb during photosynthesis?",
				options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
				correctAnswer: 1,
				explanation: "Plants use carbon dioxide, water, and light to make sugars.",
				points: 10,
			},
			{
				questionText: "What is the chemical symbol for gold?",
				options: ["Ag", "Gd", "Au", "Go"],
				correctAnswer: 2,
				explanation: "Gold's chemical symbol is Au, from the Latin word aurum.",
				points: 10,
			},
			{
				questionText: "What force keeps planets in orbit around the Sun?",
				options: ["Magnetism", "Friction", "Gravity", "Buoyancy"],
				correctAnswer: 2,
				explanation: "The Sun's gravitational attraction keeps planets in orbit.",
				points: 10,
			},
			{
				questionText: "Which part of a cell contains most of its genetic material?",
				options: ["Nucleus", "Cell membrane", "Ribosome", "Cytoplasm"],
				correctAnswer: 0,
				explanation: "In most eukaryotic cells, DNA is primarily stored in the nucleus.",
				points: 10,
			},
			{
				questionText: "At sea level, what is the approximate boiling point of water?",
				options: ["0°C", "50°C", "100°C", "150°C"],
				correctAnswer: 2,
				explanation: "Pure water boils at approximately 100°C at standard pressure.",
				points: 10,
			},
		],
	},
	{
		title: "World History Essentials",
		slug: "world-history-essentials",
		description:
			"Review key events, inventions, and civilizations from world history.",
		category: "History",
		difficulty: "Beginner" as const,
		durationMinutes: 7,
		featured: false,
		questions: [
			{
				questionText: "The ancient Olympic Games began in which civilization?",
				options: ["Roman", "Greek", "Persian", "Egyptian"],
				correctAnswer: 1,
				explanation: "The ancient Olympic Games were held in Olympia in ancient Greece.",
				points: 10,
			},
			{
				questionText: "Which invention is Johannes Gutenberg best known for in Europe?",
				options: ["The compass", "The telescope", "The printing press", "The steam engine"],
				correctAnswer: 2,
				explanation: "Gutenberg's movable-type printing press helped books spread widely.",
				points: 10,
			},
			{
				questionText: "The Great Wall is a historic landmark in which country?",
				options: ["India", "China", "Japan", "Mongolia"],
				correctAnswer: 1,
				explanation: "The Great Wall is a series of fortifications in China.",
				points: 10,
			},
			{
				questionText: "Which civilization built the city of Machu Picchu?",
				options: ["Maya", "Aztec", "Inca", "Olmec"],
				correctAnswer: 2,
				explanation: "Machu Picchu was built by the Inca in the Andes.",
				points: 10,
			},
			{
				questionText: "The Renaissance began in which European country?",
				options: ["Italy", "Norway", "Portugal", "Poland"],
				correctAnswer: 0,
				explanation: "The Renaissance began in Italian city-states before spreading across Europe.",
				points: 10,
			},
		],
	},
];

async function seed() {
	await connectDatabase();
	let addedQuizzes = 0;
	for (const item of quizzes) {
		if (await Quiz.exists({ slug: item.slug })) continue;

		const { questions, ...quizData } = item;
		const session = await mongoose.startSession();
		try {
			await session.withTransaction(async () => {
				const [quiz] = await Quiz.create(
					[{ ...quizData, questionCount: questions.length, published: true }],
					{ session },
				);
				await Question.insertMany(
					questions.map((question, order) => ({ ...question, quizId: quiz._id, order })),
					{ session },
				);
			});
			addedQuizzes += 1;
		} finally {
			await session.endSession();
		}
	}
	console.log(`Added ${addedQuizzes} quizzes; ${quizzes.length - addedQuizzes} already existed.`);
	await mongoose.disconnect();
}

seed().catch(async (error) => {
	console.error(error);
	await mongoose.disconnect();
	process.exit(1);
});
