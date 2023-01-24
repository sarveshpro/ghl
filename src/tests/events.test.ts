import request from 'supertest';
import App from '@/app';
import { CreateEventDto } from '@dtos/events.dto';
import EventsRoute from '@routes/events.route';
import { execSync } from 'child_process';

// Run reset command to clear the database before running the tests
beforeAll(() => {
  execSync('npm run db:reset');
  execSync('npm run db:setup');
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Events', () => {
  describe('[GET] /events', () => {
    it('response statusCode 200', () => {
      const eventsRoute = new EventsRoute();
      const app = new App([eventsRoute]);

      return request(app.getServer()).get(`${eventsRoute.path}`).expect(200);
    });
  });
  describe('[POST] /events', () => {
    it('response should have have 200', () => {
      const eventData: CreateEventDto = {
        time: '2023-01-24T09:00:00.000+05:30',
        duration: 30,
      };
      const eventsRoute = new EventsRoute();
      const app = new App([eventsRoute]);

      return request(app.getServer()).post('/events').send(eventData).expect(201);
    });
    it('response should have 409 status code because trying to create a overlapping event', () => {
      const eventData: CreateEventDto = {
        time: '2023-01-24T09:00:00.000+05:30',
        duration: 30,
      };
      const eventsRoute = new EventsRoute();
      const app = new App([eventsRoute]);

      return request(app.getServer()).post('/events').send(eventData).expect(409);
    });
  });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
