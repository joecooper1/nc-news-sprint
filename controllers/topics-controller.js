const { selectTopics, insertTopic } = require("../models/topics-model");

const getTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};

const postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(topic => {
      res.status(201).send({ topic: topic[0] });
    })
    .catch(err => next(err));
};

module.exports = { getTopics, postTopic };
