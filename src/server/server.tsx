import { createServer } from 'http';

const selectedRegex = /^(movie|tvshow)-(\d+)$/;

export const server = createServer(async (req, res) => {
    if (req.url === '/') {
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});
