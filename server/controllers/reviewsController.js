const axios = require('axios');

module.exports = {
  get: (req, res) => {
    // Finding a way to add query params in axios config would be cleaner
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const { sort } = req.query;
    axios.get(`${process.env.HOSTED_ATLIER_API_ROUTE}/reviews?sort=${sort}&product_id=${req.query.product_id}&page=${page}&count=${count}`, {
      headers: {
        Authorization: process.env.GITHUB_API_KEY,
      },
    })
      .then((response) => {
        res.status(200).send(response.data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  getMeta: (req, res) => {
    // Finding a way to add query params in axios config would be cleaner
    axios.get(`${process.env.HOSTED_ATLIER_API_ROUTE}/reviews/meta?product_id=${req.query.product_id}`, {
      headers: {
        Authorization: process.env.GITHUB_API_KEY,
      },
    })
      .then((response) => {
        // Object.keys(response).length === 0 ?
        //   res.status(404).send('no ratings available'):
        res.status(200).send(response.data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  post: (req, res) => {
    // Finding a way to add query params in axios config would be cleaner
    axios.post(
      `${process.env.HOSTED_ATLIER_API_ROUTE}/reviews`,
      req.body,
      {
        headers: {
          Authorization: process.env.GITHUB_API_KEY,
        },
        data: req.body,
      },
    )
      .then((response) => {
        res.status(200).send(response.data);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  putHelpful: (req, res) => {
    axios.put(`${process.env.HOSTED_ATLIER_API_ROUTE}/reviews/${req.params.review_id}/helpful`, null, {
      headers: {
        Authorization: process.env.GITHUB_API_KEY,
      },
    })
      .then(() => {
        res.status(204).send('Marked as helpful');
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  },
  putReport: (req, res) => {
    axios.put(`${process.env.HOSTED_ATLIER_API_ROUTE}/reviews/${req.params.review_id}/report`, null, {
      headers: {
        Authorization: process.env.GITHUB_API_KEY,
      },
    })
      .then(() => {
        res.status(204).send('Review reported');
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  },
};
