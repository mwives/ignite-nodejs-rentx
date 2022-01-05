import { ICreateCategoryDTO } from "@modules/cars/dtos/ICreateCategoryDTO";
import { Category } from "@modules/cars/infra/typeorm/entities/Category";

interface ICategoriesRepository {
  create({ name, description }: ICreateCategoryDTO): Promise<void>;
  findByName(name: string): Promise<Category | undefined>;
  list(): Promise<Category[]>;
}

export { ICategoriesRepository };
