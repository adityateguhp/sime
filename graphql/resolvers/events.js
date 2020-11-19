const { UserInputError } = require('apollo-server');

const { validateEventInput } = require('../../util/validators');
const Event = require('../../model/Event');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getEvents(_, { projectId }, context) {
      try {
        const events = await Event.find({ project_id: projectId }).sort({ createdAt: -1 });
        if (events) {
          return events;
        } else {
          throw new Error('Events not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getEvent(_, { eventId }) {
      try {
        const event = await Event.findById(eventId);
        if (event) {
          return event;
        } else {
          throw new Error('Event not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addEvent(_, {
      name,
      description,
      location,
      start_date,
      end_date,
      project_id,
      picture,
    }, context) {
      const { valid, errors } =
        validateEventInput(
          name,
          start_date,
          end_date
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newEvent = new Event({
        name,
        description,

        location,
        start_date,
        end_date,
        project_id,
        picture,
        createdAt: new Date().toISOString()
      });

      const res = await newEvent.save();

      return res;
    },
    async updateEvent(_, {
      eventId,
      name,
      description,
      location,
      start_date,
      end_date,
      picture
    }, context) {
      try {
        const { valid, errors } =
          validateEventInput(
            name,
            start_date,
            end_date
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          { _id: eventId },
          {
            name,
            description,

            location,
            start_date,
            end_date,
            picture,
          },
          { new: true });

        return updatedEvent;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteEvent(_, { eventId }, context) {
      try {
        const event = await Event.findById(eventId);
        await event.delete();
        return 'External deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};