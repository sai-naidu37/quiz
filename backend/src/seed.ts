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
];

async function seed() {
	await connectDatabase();
	const oldQuizzes = await Quiz.find({ slug: { $in: ["javascript-fundamentals", "general-knowledge", "science-essentials"] } }).select("_id");
	await Question.deleteMany({ quizId: { $in: oldQuizzes.map((quiz) => quiz._id) } });
	await Quiz.deleteMany({ slug: { $in: ["javascript-fundamentals", "general-knowledge", "science-essentials"] } });
	for (const item of quizzes) {
		const quiz = await Quiz.findOneAndUpdate(
			{ slug: item.slug },
			{
				title: item.title,
				slug: item.slug,
				description: item.description,
				category: item.category,
				difficulty: item.difficulty,
				durationMinutes: item.durationMinutes,
				featured: item.featured,
				published: true,
				questionCount: item.questions.length,
			},
			{
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
				runValidators: true,
			},
		);
		await Question.deleteMany({ quizId: quiz._id });
		await Question.insertMany(
			item.questions.map((question, order) => ({ ...question, quizId: quiz._id, order })),
		);
	}
	console.log("Seeded 3 quizzes: Beginner 3, Intermediate 10, Advanced 15.");
	await mongoose.disconnect();
}

seed().catch(async (error) => {
	console.error(error);
	await mongoose.disconnect();
	process.exit(1);
});
