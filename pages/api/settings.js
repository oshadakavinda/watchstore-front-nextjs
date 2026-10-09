import {mongooseConnect} from "@/lib/mongoose";
import {Setting} from "@/models/Setting";

export default async function handle(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }

  await mongooseConnect();

  const {name} = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({error: 'Setting name is required'});
  }

  const setting = await Setting.findOne({name});
  res.json(setting || {});
}