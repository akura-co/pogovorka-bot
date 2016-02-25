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
  return function (req, res) {
    var proverb = _.filter(config.proverb, function (d) {return d.toLowerCase().indexOf(req.body.message.toLowerCase()) != -1})
    if (!proverb.length)
      proverb = config.proverb
    console.log(req.body, _.sample(proverb))
    res.json({method: 'sendMessage', chat_id: req.body.message.chat.id, text: _.sample(proverb)})
  }
}
