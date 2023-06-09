import { initMongoose } from "../../../lib/mongoose"
import Post from "../../../models/Post"
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}

export async function findAllPosts() {
  return Post.find().exec()
}

export async function findOnePost(id) {
  return Post.find({"_id": {$in: id}}).exec()
}


export default async function handle(req, res) {
  // await to wait for connection
  await initMongoose()
  const {ids} = req.query

  if (req.method === "GET") {
      try {
        if (ids) {
          const posts = await Post.find({"_id": {$in: ids.split(",")}}).exec() 
          res.status(200).json({ success: true, data: posts })
        } else {
          const posts = await Post.find().exec()
          res.status(200).json({ success: true, data: posts })
        }

      } catch (error) {
        res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' })
      }
  } else {
    // This block is for req.method === "POST"
    try {
      const { name, prompt, photo, colour, product, size } = req.body
      const photoUrl = await cloudinary.uploader.upload(photo)
      const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url,
        colour,
        product,
        size,
        
      })
      res.status(200).json({ success: true, data: newPost })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to create a post, please try again' })
    }
  }
}