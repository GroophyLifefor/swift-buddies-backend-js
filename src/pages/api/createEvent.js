import Event from '@/models/event';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';
import {User} from '@/models/user';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  if (!req.body.category) {
    return res
      .status(400)
      .json({ message: 'category is required. (use body to send)' });
  }

  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: 'name is required. (use body to send)' });
  }

  if (!req.body.description) {
    return res
      .status(400)
      .json({ message: 'description is required. (use body to send)' });
  }

  if (!req.body.startDate) {
    return res
      .status(400)
      .json({ message: 'startDate is required. (use body to send)' });
  }

  const { error: startDateError } = StringToDateTime(req.body.startDate);
  if (startDateError) {
    return res.status(400).json({ message: 'startDate in a invalid format.' });
  }

  if (!req.body.dueDate) {
    return res
      .status(400)
      .json({ message: 'dueDate is required. (use body to send)' });
  }

  const { error: dueDateError } = StringToDateTime(req.body.dueDate);
  if (dueDateError) {
    return res.status(400).json({ message: 'dueDate in a invalid format.' });
  }

  if (!req.body.latitude) {
    return res
      .status(400)
      .json({ message: 'latitude is required. (use body to send)' });
  }

  if (!req.body.longitude) {
    return res
      .status(400)
      .json({ message: 'longitude is required. (use body to send)' });
  }

  const event = {
    uid: uuidv4(),
    owner_uid: await getUserIdByToken(tokenFromHeader),
    category: req.body.category,
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    dueDate: req.body.dueDate,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };
  const newEvent = new Event(event);
  newEvent.save();

  const responseBody = {
    uid: event.uid,
  };
  console.log({
    endpointUUID,
    type: "response",
    status: 200,
    responseBody
  })
  res.status(200).json(responseBody);
}
