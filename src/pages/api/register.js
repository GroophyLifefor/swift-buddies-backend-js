import { User, isUserRegistered } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!req.body.registerType) {
    return res
      .status(400)
      .json({ message: 'registerType is required. (use body to send)' });
  }

  if (!req.body.accessToken) {
    return res
      .status(400)
      .json({ message: 'accessToken is required. (use body to send)' });
  }

  async function register(data) {
    const { registerType, email, name, picture } = data;
    const token = uuidv4();

    const existingUser = await isUserRegistered(email);

    if (existingUser) {
      existingUser.lastLoginDate = new Date();
      existingUser.save();

      return {
        token: existingUser.token,
        type: 'existing',
      };
    }

    const uid = uuidv4();

    const newUser = new User({
      registerType,
      email,
      uid,
      username: uid,
      lastLoginDate: new Date(),
      registerDate: new Date(),
      name,
      picture,
      token,
    });
    newUser.save();
    return {
      token,
      type: 'new',
    };
  }

  if (req.body.registerType === 'google') {
    const url = new URL('https://www.googleapis.com/oauth2/v3/userinfo');
    url.searchParams.append('access_token', req.body.accessToken);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: 'Failed to get user info from Google.' });
    }
    
    const data = await response.json();

    const { token, type } = await register({
      registerType: req.body.registerType,
      email: data.email,
      name: data.name,
      picture: data.picture,
    });

    res.status(200).json({ token, type });
  } else if (req.body.registerType === 'apple') {
    res.status(400).json({ message: 'Apple is not supported yet.' });
  } else {
    res.status(400).json({ message: 'Invalid registerType.' });
  }
}
