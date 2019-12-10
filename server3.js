const http = require('http');

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer((req,res) => {
    // NOTE: cookie parsing 과정
    // // 예시 : mycookie=test; mycookie2=test2
    // let c = req.headers.cookie;
    // c = c.split(';'); // mycookie=test, mycookie2=test2
    // console.log("split(';') 결과 : " + c);
    // // ;로 나뉜 쿠키들을 반복문처럼 돌면서 split('=')
    // c = c.map(v => v.split('=')); // mycookie,test, mycookie2,test2
    // console.log("map(split) 결과 : " + c);
    // c = c.map(([k, ...vs]) => [k, vs.join('=')]); // mycookie,test, mycookie2,test2
    // console.log("map(join) 결과 : " + c);
    // c = c.reduce((acc, [k, v]) => {
    //     acc[k.trim()] = decodeURIComponent(v);
    //     return acc;
    // }, {});
    // console.log("reduce 결과 : " + c);

    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    res.writeHead(200, { 'Set-Cookie' : 'mycookie=test' });
    res.end('Hello Cookie');
}).listen(8082, () => {
    console.log('8082번 포트에서 서버 대기 중입니다!')
});