// profile.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { Profile } from './DbIntegrate/profile.entity';

// Create a mock repository object with Jest functions
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new profile', async () => {
      const createData = { name: 'John', age: 30, email: 'john@example.com' };
      const savedProfile = { id: 1, ...createData };

      mockRepository.create.mockReturnValue(createData);
      mockRepository.save.mockResolvedValue(savedProfile);

      const result = await service.create(createData);

      expect(mockRepository.create).toHaveBeenCalledWith(createData);
      expect(mockRepository.save).toHaveBeenCalledWith(createData);
      expect(result).toEqual(savedProfile);
    });
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      const profilesArray = [{ id: 1, name: 'John', age: 30 }];
      mockRepository.find.mockResolvedValue(profilesArray);

      const result = await service.findAll();
      expect(result).toEqual(profilesArray);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single profile by id', async () => {
      const profile = { id: 1, name: 'John', age: 30 };
      mockRepository.findOneBy.mockResolvedValue(profile);

      const result = await service.findOne(1);
      expect(result).toEqual(profile);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if profile not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });
});
