import { server } from './server';

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${server.address().port}...`);
});

process.addListener('unhandledRejection', e => {
    console.log(e);
});
