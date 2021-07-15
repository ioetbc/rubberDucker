import express from 'express';

const main = async () => {
   const app = express();
   app.get('/', (_req, res) => {
      res.send('fuck yeah')
   });
   app.listen(3002, () => {
      console.log('lsitening on localhost 3002')
   });
}

main();
