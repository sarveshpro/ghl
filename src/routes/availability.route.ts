import { Router } from 'express';
import AvailabiltyController from '@controllers/availability.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { GetAvailabilityDto } from '@/dtos/availability.dto';

class EventsRoute implements Routes {
  public path = '/availability';
  public router = Router();
  public availabilityController = new AvailabiltyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(`${this.path}`, this.availabilityController.getAvailability);
    this.router.get(`${this.path}`, validationMiddleware(GetAvailabilityDto, 'query'), this.availabilityController.getAvailability);
  }
}

export default EventsRoute;
