import { Quiz } from "../models/Quiz";

export interface QuizFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  sort?: string;
}

export class QuizRepository {
  async list(filters: QuizFilters) {
    const query: Record<string, unknown> = { published: true };
    if (filters.category) query.category = filters.category;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.search) query.$text = { $search: filters.search };
    const sort = filters.sort === "popular" ? "-totalAttempts" : "-createdAt";
    return Quiz.find(query).sort(sort).lean();
  }

  async findPublishedById(id: string) {
    return Quiz.findOne({ _id: id, published: true });
  }
}