"use strict";
const axios = require("axios");
const Stock = require("../models/Stock");
const crypto = require("crypto");

module.exports = function (app) {
  function anonymizeIP(ip) {
    return crypto.createHash("sha256").update(ip).digest("hex");
  }

  app.route("/api/stock-prices").get(async function (req, res) {
    try {
      let { stock, like } = req.query;
      const userIP = anonymizeIP(req.ip);
      const stocks = Array.isArray(stock) ? stock : [stock];
      const stockDataArr = [];

      for (let sym of stocks) {
        let stockDoc = await Stock.findOne({ symbol: sym.toUpperCase() });
        if (!stockDoc)
          stockDoc = await Stock.create({ symbol: sym.toUpperCase() });

        if (like === "true" && !stockDoc.ipHashes.includes(userIP)) {
          stockDoc.likes += 1;
          stockDoc.ipHashes.push(userIP);
          await stockDoc.save();
        }

        const apiRes = await axios.get(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${sym}/quote`
        );
        const price = Number(apiRes.data.latestPrice);

        stockDataArr.push({
          stock: sym.toUpperCase(),
          price,
          likes: stockDoc.likes,
        });
      }

      // Two stock relative likes
      if (stockDataArr.length === 2) {
        const rel_likes = [
          stockDataArr[0].likes - stockDataArr[1].likes,
          stockDataArr[1].likes - stockDataArr[0].likes,
        ];
        return res.json({
          stockData: [
            {
              stock: stockDataArr[0].stock,
              price: stockDataArr[0].price,
              rel_likes: rel_likes[0],
            },
            {
              stock: stockDataArr[1].stock,
              price: stockDataArr[1].price,
              rel_likes: rel_likes[1],
            },
          ],
        });
      }

      // Single stock response
      res.json({
        stockData: {
          stock: stockDataArr[0].stock,
          price: stockDataArr[0].price,
          likes: stockDataArr[0].likes,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
};
