import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Address} from "@/models/Address";

// Only allow these fields to be updated
const ALLOWED_FIELDS = ['name', 'email', 'city', 'postalCode', 'streetAddress', 'country'];

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 200);
}

function pickAllowedFields(body) {
  const sanitized = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      sanitized[field] = sanitizeString(body[field]);
    }
  }
  return sanitized;
}

export default async function handle(req, res) {
  if (req.method !== 'PUT' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  const userEmail = session.user.email;

  if (req.method === 'PUT') {
    const data = pickAllowedFields(req.body);
    const address = await Address.findOne({userEmail});
    if (address) {
      res.json(await Address.findByIdAndUpdate(address._id, data, {new: true}));
    } else {
      res.json(await Address.create({userEmail, ...data}));
    }
  }

  if (req.method === 'GET') {
    const address = await Address.findOne({userEmail});
    res.json(address);
  }
}