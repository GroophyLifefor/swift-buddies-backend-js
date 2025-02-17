import Event from '@/models/event';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';
import {User} from '@/models/user';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const endpointUUID = uuidv4();
  console.log({
    endpointUUID,
    type: "request",
    method: "createEvent",
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

  if (!req.query.eventUid) {
    return res
      .status(400)
      .json({ message: 'eventUid is required. (use query to send)' });
  }

  const event = await Event.findOne({ uid: req.query.eventUid });
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  if (event.owner_uid !== user.uid) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await Event.deleteOne({ uid: req.query.eventUid });

  const responseBody = {
    uid: event.uid,
    message: 'Event deleted successfully.'
  };
  console.log({
    endpointUUID,
    type: "response",
    status: 200,
    responseBody
  })
  res.status(200).json(responseBody);
}
