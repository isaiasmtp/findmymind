import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";

export const userRepositotyMock = {
    provide: getRepositoryToken(UserEntity),
    useValue: {
      exists: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn()
    }
}