var _ = require('underscore')
var package = require('./package')
var config = package[package.name]

module.exports = () => {
  function filter (q) {
    var data = _.filter(config.proverb, d => d.toLowerCase().indexOf(q.toLowerCase()) != -1)
    if (_.size(data))
      return data
    return config.proverb
  }
  return (req, res) => {
    console.log(req.body)
    var json = {}
    if (req.body.inline_query) {
      json = {
        method: 'answerInlineQuery',
        inline_query_id: req.body.inline_query.id,
        results: JSON.stringify(_.map(filter(req.body.inline_query.query), (d, i) => ({
          type: 'article',
          id: String(i),
          title: d,
          message_text: d
        })))
      }
    }
    if (req.body.message)
      json = {method: 'sendMessage', chat_id: req.body.message.chat.id, text: _.sample(filter(req.body.message.text))}
    console.log(json)
    res.json(json)
  }
}
