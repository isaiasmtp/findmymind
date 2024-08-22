import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { userRepositotyMock } from '../testing/user-repository.mock';
import { CreateUserDTO } from './dto/create-user-dto';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        userRepositotyMock
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Create', () => {

    test("method create", async () => {
      const data: CreateUserDTO = {
        email: "test@test.com",
        password: "",
        name: ""
      }

      const result = await userService.create(data);


    })

  })

  describe('Read', () => {
    
  })

  describe('Update', () => {
    
  })

  describe('Delete', () => {
    
    test("", async () => {

    })

  })


});
