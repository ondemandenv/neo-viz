import express, {Express, Request, Response} from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import {Neo4jQuery} from "./neo4j-query";
import {promises as dns} from 'dns';
import * as cors from 'cors';


const app: Express = express();

/*
const corsOptions: cors.CorsOptions = {
    origin: ['http://localhost:3000', 'https://yourdomain.com'], // Replace with your allowed origins
};
*/

app.use(cors.default(/*corsOptions*/));

const neo4j: Neo4jQuery = new Neo4jQuery()

app.get('/rrrr', async (req: Request, res: Response) => {
    const addre = await dns.resolve(`neo4j`)

    console.log(`addreaddreaddre>${addre}`)

    const rsl = await neo4j.exeCypher(`
     MATCH     (root)
     -[l1]->(lc1:LifeCycle)-[r1:lifecycle]->(node1)
     -[l2]->(lc2:LifeCycle)-[r2:lifecycle]->(node2)
     -[l3]->(lc3:LifeCycle)-[r3:lifecycle]->(node3)
     -[l4]->(lc4:LifeCycle)-[r4:lifecycle]->(node4)
     WHERE  "Ondemand__root" in root.classesNames
     return root, node1, node2, node3, node4, l1,l2,l3,l4, lc1,lc2,lc3,lc4,  r1,r2,r3,r4
     `)
    res.send(rsl);
});
app.get('/gh', async (req: Request, res: Response) => {


    const addre = await dns.resolve(`neo4j`)

    console.log(`addreaddreaddre>${addre}`)

    const rsl = await neo4j.exeCypher(`
     MATCH (a)-[r1]-> (b)-[r2:lifecycle]-> (n)  WHERE  "Ondemand__GithubApp" in n.classesNames  return n, a,b, r1, r2;
     `)
    res.send(rsl);
});

app.get(`/aaa`, async (req: Request, resp: Response) => {
    resp.send(await neo4j.exeCypher(`
    MATCH     (root)
     -[l1]->(lc1:LifeCycle)-[r1:lifecycle]->(node1)
     -[l2]->(lc2:LifeCycle)-[r2:lifecycle]->(node2)
     -[l3]->(lc3:LifeCycle)-[r3:lifecycle]->(node3)
     -[l4]->(lc4:LifeCycle)-[r4:lifecycle]->(node4)
     -[l5]->(node5:EnverPipeline)
     -[l6]->(node6:RunningEnverStacksProducers)
     WHERE  "Ondemand__root" in root.classesNames
     return  node2, node3, node4, node5, node6, l3,l4,l5,l6, lc3,lc4, r3,r4`))

})


app.get(`/bbb`, async (req: Request, resp: Response) => {
    const buildIds = req.originalUrl.substring(5).split(',')

    let tmp = buildIds.map(bid => `n.OdmdBuildId='${bid}'`).join(' or ');
//    console.log(`bbbb --->>> tmp ---->>>>${tmp}`)
    const cypher = `
    MATCH     (root)
     -[l1]->(lc1:LifeCycle)-[r1:lifecycle]->(node1)
     -[l2]->(lc2:LifeCycle)-[r2:lifecycle]->(node2)
     -[l3]->(lc3:LifeCycle)-[r3:lifecycle]->(node3)
     -[l4]->(lc4:LifeCycle)-[r4:lifecycle]->(node4)
     -[l5]->(node5:EnverPipeline)
     -[l6]->(node6:RunningEnverStacksProducers)
     WHERE  "Ondemand__root" in root.classesNames and ( ${buildIds.map(bid => `node2.OdmdBuildId='${bid}'`).join(' or ')} )
     return  node2, node3, node4, node5, node6, l3,l4,l5,l6, lc3,lc4, r3,r4
     

    
    `;
//    console.log(`bbbb --->>> cypher ---->>>>${cypher}`)
    resp.send(await neo4j.exeCypher(cypher))

})


// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server
const httpsServer = https.createServer({
    key: fs.readFileSync('cert_key/key.pem'),
    cert: fs.readFileSync('cert_key/cert.pem')
}, app);

// Start both servers
httpServer.listen(80, '0.0.0.0', () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, '0.0.0.0', () => {
    console.log('HTTPS Server running on port 443');
});
