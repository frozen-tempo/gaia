const axios = require("axios");
const https = require("https");
const cheerio = require("cheerio");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const url =
  "https://www.steelforlifebluebook.co.uk/ub/ec3-ukna/section-properties-dimensions-properties/";

const AxiosInstance = axios.create();

AxiosInstance.get(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const properties = $("table > tbody > tr");
    console.log(html);
  })
  .catch(console.error);
