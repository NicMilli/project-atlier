const axios = require('axios');
const uuid = require('uuid');

// making in-memory temporary session storage on server
// it's ideal to store the info in main db
const sessions = {};

module.exports = {
  get: (req, res) => {
    // Finding a way to add query params in axios config would be cleaner
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    // when it's loaded, check for sessionID
    /// if it's the first time, create one.
    const sessionID = req.cookies.sessionID || uuid.v4();
    // if it's new, create a new Set to store data;
    sessions[sessionID] = sessions[sessionID]
      || { helpfulQuestions: new Set(), helpfulAnswers: new Set() };
    // set session cookie
    res.cookie('sessionID', sessionID, { httpOnly: true });
    if (req.query.product_id) {
      axios.get(`${process.env.HOSTED_ATLIER_API_ROUTE}/qa/questions/?product_id=${req.query.product_id}&page=${req.query.page}&count=${req.query.count}`, {
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
    } else {
      axios.get(`${process.env.HOSTED_ATLIER_API_ROUTE}/qa/questions/${req.params.question_id}/answers?page=${page}&count=${count}`, {
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
    }
  },
  postQuestion: (req, res) => {
    axios.post(
      `${process.env.HOSTED_ATLIER_API_ROUTE}/qa/questions`,
      req.body,
      {
        headers: {
          Authorization: process.env.GITHUB_API_KEY,
        },
      },
    )
      .then(() => {
        res.status(201).send(res.data);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  },
  postAnswer: (req, res) => {
    axios.post(
      `${process.env.HOSTED_ATLIER_API_ROUTE}/qa/questions/${req.params.question_id}/answers`,
      req.body,
      {
        headers: {
          Authorization: process.env.GITHUB_API_KEY,
        },
      },
    )
      .then(() => {
        res.status(201).send(res.data);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  },
  putQuestionHelpful: (req, res) => {
    if (!sessions[req.cookies.sessionID].helpfulQuestions.has(req.params.question_id)) {
      axios.put(
        `${process.env.HOSTED_ATLIER_API_ROUTE}/qa/questions/${req.params.question_id}/helpful`,
        null,
        {
          headers: {
            Authorization: process.env.GITHUB_API_KEY,
          },
        },
      )
        .then(() => {
          sessions[req.cookies.sessionID].helpfulQuestions.add(req.params.question_id);
          res.status(204).send(res.data);
        })
        .catch((err) => {
          res.status(422).send(err);
        });
    } else {
      res.status(208).send(res.data);
    }
  },
  putAnswerHelpful: (req, res) => {
    if (!sessions[req.cookies.sessionID].helpfulAnswers.has(req.params.answer_id)) {
      axios.put(
        `${process.env.HOSTED_ATLIER_API_ROUTE}/qa/answers/${req.params.answer_id}/helpful`,
        null,
        {
          headers: {
            Authorization: process.env.GITHUB_API_KEY,
          },
        },
      )
        .then(() => {
          sessions[req.cookies.sessionID].helpfulAnswers.add(req.params.answer_id);
          res.status(204).send(res.data);
        })
        .catch((err) => {
          res.status(422).send(err);
        });
    } else {
      res.status(208).send(res.data);
    }
  },
  putAnswerReport: (req, res) => {
    axios.put(
      `${process.env.HOSTED_ATLIER_API_ROUTE}/qa/answers/${req.params.answer_id}/report`,
      null,
      {
        headers: {
          Authorization: process.env.GITHUB_API_KEY,
        },
      },
    )
      .then(() => {
        res.status(204).send(res.data);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  },
};
