import ApiCustomError from '@/types/api-custom-error';
import { NewsRepository } from "@/app/(server)/modules/news/news.repository";
import { CreateNewsDTO, NewsDTO, NewsFilterDTO, CreateNewsCategoryDTO, CreateTagDTO, FullNewsDTO } from '@/app/(server)/modules/news/news.types';

export interface INewsService {
    createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError>;
    editNews(id: string, news: Partial<CreateNewsDTO>): Promise<NewsDTO | null | ApiCustomError>;
    getNewsWithFilters(filters: NewsFilterDTO): Promise<NewsDTO[] | null | ApiCustomError>;
    createNewsCategory(category: CreateNewsCategoryDTO): Promise<unknown | null | ApiCustomError>;
    getNewsBySlug(slug: string ): Promise < FullNewsDTO | null | ApiCustomError>
    createTag(tag: CreateTagDTO): Promise<unknown | null | ApiCustomError>;
    assignTagsToNews(newsId: string, tagIds: number[], options?: { remove?: boolean }): Promise<NewsDTO | null | ApiCustomError>;
    assignCategoriesToNews(newsId: string, categoryIds: number[], options?: { remove?: boolean }): Promise<NewsDTO | null | ApiCustomError>;
    deleteNews(id: string): Promise<NewsDTO | null | ApiCustomError>;
}

export class NewsService implements INewsService {
    private readonly repository: NewsRepository;

    constructor() {
        this.repository = new NewsRepository();
    }

    async createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError> {
        //TODO: later handle analytics from here
        return await this.repository.createNews(news);
    }

    //this would handle stuff like edit news
    //unpublish or save as draft, publish too.
    async editNews(slug: string, news: Partial<CreateNewsDTO>): Promise<NewsDTO | null | ApiCustomError> {
        //TODO: later handle analytics from here if unpublished
        return await this.repository.editNews(slug, news);
    }

    async getNewsWithFilters(filters: NewsFilterDTO): Promise<NewsDTO[] | null | ApiCustomError> {
        return await this.repository.getNewsWithFilters(filters);
    }

    async createNewsCategory(category: CreateNewsCategoryDTO): Promise<unknown | null | ApiCustomError> {
        return await this.repository.createNewsCategory(category);
    }

    async createTag(tag: CreateTagDTO): Promise<unknown | null | ApiCustomError> {
        return await this.repository.createTag(tag);
    }

    async assignTagsToNews(
        slug: string,
        tagIds: number[],
        options: { remove?: boolean } = {}
    ): Promise<NewsDTO | null | ApiCustomError> {
        return await this.repository.assignTagsToNews(slug, tagIds, options);
    }

    async assignCategoriesToNews(
        slug: string,
        categoryIds: number[],
        options: { remove?: boolean } = {}
    ): Promise<NewsDTO | null | ApiCustomError> {
        return await this.repository.assignCategoriesToNews(slug, categoryIds, options);
    }

    async deleteNews(slug: string): Promise<NewsDTO | null | ApiCustomError> {
        return await this.repository.deleteNews(slug);
    }

    async getNewsBySlug(slug: string ): Promise < FullNewsDTO | null | ApiCustomError> {
        return await this.repository.getNewsBySlug(slug)
    }
}
