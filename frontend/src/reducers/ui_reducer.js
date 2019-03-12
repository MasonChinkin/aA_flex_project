import { RECEIVE_CURRENT_JOURNEY } from "../actions/journey_actions";

const initialState = { currentJourneyId: null };

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CURRENT_JOURNEY:
      return { currentJourneyId: action.journeyPayload.journey._id };
    default:
      return state;
  }
}