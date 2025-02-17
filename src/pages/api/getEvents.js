import Event from '@/models/event';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';
import {User} from '@/models/user';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const endpointUUID = uuidv4();
  console.log({
    endpointUUID,
    type: "request",
    method: "getEvents",
    body: req.body,
    headers: req.headers,
    query: req.query
  });

  const tokenFromHeader = parseBearer(req.headers.authorization);
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use headers as "Authorization" to send)' });
  }
  const user = await User.findOne({ token: tokenFromHeader });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const fromCategory = req.query.fromCategory || '';

  const query = req.query.query || '';

  let searchQuery = {};
  if (query) {
    searchQuery = { $text: { $search: query } };
  }

  let events = [];
  if (fromCategory) {
    events = await Event.find({
      ...searchQuery,
      category: fromCategory,
    }).sort({ startDate: 1 });
  } else {
    events = await Event.find(searchQuery).sort({ startDate: 1 });
  }

  const clientUid = await getUserIdByToken(tokenFromHeader);

  let cleanedEvents = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (!event) {
      continue;
    }
    cleanedEvents.push({
      uid: event.uid,
      owner_uid: event.owner_uid,
      category: event.category,
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      dueDate: event.dueDate,
      latitude: event.latitude,
      longitude: event.longitude,
      isSelf: event.owner_uid === clientUid
    });
  }

  const responseBody = {
    count: events.length,
    events: cleanedEvents,
  };
  console.log({
    endpointUUID,
    type: "response",
    method: "getEvents",
    responseBody
  });

  return res.status(200).json(responseBody);
}
