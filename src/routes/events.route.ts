import { Router } from 'express';
import EventsController from '@controllers/events.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateEventDto, GetAllEventsDto } from '@/dtos/events.dto';

class EventsRoute implements Routes {
  public path = '/events';
  public router = Router();
  public eventsController = new EventsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, validationMiddleware(GetAllEventsDto, 'query'), this.eventsController.getEvents);
    this.router.post(`${this.path}`, validationMiddleware(CreateEventDto, 'body'), this.eventsController.createEvent);
  }
}

export default EventsRoute;
