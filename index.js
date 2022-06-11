const fs = require("fs");
const http = require("http");
const url = require("url");

// const inputTxt = fs.readFileSync('./txt/input.txt', 'utf-8')

// // console.log(inputTxt);

// const textOut = `this is what we know ${inputTxt}.\nCreated on ${Date.now()}`

// fs.writeFileSync('./txt/output.txt', textOut)

// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
//           fs.writeFile(`./txt/final.txt`,`${data2}\n${data3}`,'utf-8',(err)=>{
//             console.log('file wrtten');
//           })
//         })

//     })
// } )
const replaceTemplate = (template, data) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, data.productName);
  output = output.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/{%LOCATION%}/g, data.from);
  output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
  output = output.replace(/{%LOCATION%}/g, data.from);
  output = output.replace(/{%QUANTITY%}/g, data.quantity);
  output = output.replace(/{%PRICE%}/g, data.price);
  output = output.replace(/{%ID%}/g, data.id);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);
  if (!data.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const overview = fs.readFileSync(`./templates/overview.html`, "utf-8");
const productDetail = fs.readFileSync(`./templates/product.html`, "utf-8");
const productCard = fs.readFileSync(`./templates/card.html`, "utf-8");
const data = fs.readFileSync(`./dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  const { query, pathname } = url.parse(req.url, true);
  console.log(url.parse(req.url, true));

  //HOME PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObject
      .map((element) => replaceTemplate(productCard, element))
      .join("");
    // console.log(cardsHtml);
    const output = overview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(productDetail, product);
    res.end(output);
  }
  //API ROUTE
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } //FALLBACK
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-header": "heloooo world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening.....");
});
