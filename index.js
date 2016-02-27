var
  _ = require('underscore'),
  request = require('request'),
  config = require('solid-config')

module.exports = function () {
  request({url: config.url + config.token + '/setWebhook', qs: {url: config.setWebhook}}, function (err) {
    if (err)
      console.log(err)
    else
      console.log('setWebhook ok', config.setWebhook)
  })
  var filter = function (q) {
    var data = _.filter(config.proverb, function (d) {return d.toLowerCase().indexOf(q.toLowerCase()) != -1})
    if (!data.length)
      data = config.proverb
    return data
  }
  return function (req, res) {
    console.log(req.body)
    var json = {}
    if (req.body.inline_query) {
      json = {
        method: 'answerInlineQuery',
        inline_query_id: req.body.inline_query.id,
        results: JSON.stringify(_.map(filter(req.body.inline_query.query), function (d, i) {
          return {
            type: 'article',
            id: String(i),
            title: d,
            message_text: d
          }
        }))
      }
    }
    if (req.body.message)
      json = {method: 'sendMessage', chat_id: req.body.message.chat.id, text: _.sample(filter(req.body.message.text))}
    console.log(json)
    res.json(json)
  }
}
