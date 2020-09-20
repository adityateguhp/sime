const { UserInputError } = require('apollo-server');

const { validateRoadmapInput } = require('../../util/validators');
const Roadmap = require('../../model/Roadmap');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getRoadmaps(_, {eventId}, context) {
      try {
        const roadmaps = await Roadmap.find({ event_id: eventId }).sort({ createdAt: -1 });
        if (roadmaps) {
          return roadmaps;
        } else {
          throw new Error('Roadmaps not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getRoadmap(_, { roadmapId }) {
      try {
        const roadmap = await Roadmap.findById(roadmapId);
        if (roadmap) {
          return roadmap;
        } else {
          throw new Error('Roadmap not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addRoadmap(_, {
      name,
      event_id,
      start_date,
      end_date
    }, context) {
      const { valid, errors } =
        validateRoadmapInput(
          name,
          start_date,
          end_date
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newRoadmap = new Roadmap({
        name,
        event_id,
        start_date,
        end_date,
        createdAt: new Date().toISOString()
      });

      const res = await newRoadmap.save();

      return res;
    },
    async updateRoadmap(_, {
      roadmapId,
      name,
      start_date,
      end_date,
    }, context) {
      try {
        const { valid, errors } =
          validateRoadmapInput(
            name,
            start_date,
            end_date
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
          { _id: roadmapId },
          {
            name,
            start_date,
            end_date,
          },
          { new: true });

        return updatedRoadmap;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteRoadmap(_, { roadmapId }, context) {
      try {
        const roadmap = await Roadmap.findById(roadmapId);
        await roadmap.delete();
        return 'Roadmap deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};