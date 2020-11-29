// import express from 'express';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    const { image_url } = req.query;
    if (!image_url) {
      return res.status(400).send({ message: 'image url is required' });
    }
    filterImageFromURL(image_url).then((path: string) => {
      res.sendFile(path)
      res.on('finish', () => deleteLocalFiles([path]));
    }).catch((err: string) => {
      return res.status(400).send({ message: err });
    })
  } );


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (  req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
