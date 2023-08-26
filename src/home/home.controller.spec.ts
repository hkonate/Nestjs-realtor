import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common/exceptions';
const mockUser = {
  id: 53,
  name: 'Laith',
  email: 'Laith@laith.com',
  phone: '555 555 5555',
};

const mockHome = {
  id: 1,
  address: '2345William Str',
  cit: 'Toronto',
  price: 1500000,
  property_type: PropertyType.RESIDENTIAL,
  image: 'img1',
  number_of_bedrooms: 3,
  number_of_bathroooms: 2.5,
};

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
            updateHomeById: jest.fn().mockReturnValue,
          },
        },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const mockGetHomes = jest.fn().mockReturnValue([]);
      jest.spyOn(homeService, 'getHomes').mockImplementation(mockGetHomes);
      await controller.getHomes('Toronto', '1500000');

      expect(mockGetHomes).toBeCalledWith({
        city: 'Toronto',
        price: {
          gte: 1500000,
        },
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      name: 'Laith',
      id: 30,
      iat: 1,
      exp: 2,
    };
    const mockCreateHomeParams = {
      id: 1,
      address: '2345William Str',
      cit: 'Toronto',
      price: 1500000,
      property_type: PropertyType.RESIDENTIAL,
      image: 'img1',
      number_of_bedrooms: 3,
      number_of_bathroooms: 2.5,
    };
    it("should throw unath error if realtor didn't creat home", async () => {
      await expect(
        controller.updateHome(5, mockCreateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
