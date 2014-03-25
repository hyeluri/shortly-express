var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName:'users',
  hasTimestamps: true,
  initialize: function(params){
    this.set('username', params['username']);
    var hash = bcrypt.hashSync(params['password']);
    this.set('password', hash);
  },
  isValid:function(password, errCallback, okCallback){
    this.query()
      .where({'username': this.get('username')})
      .then(function(model){
        console.log("model length:", model);
        if(model.length === 1){
          bcrypt.compare(password, model[0].password, function(err, res){
            console.log("@User.isValid? res" + res);
            if(res){
              okCallback(model);
            }
          });
        } else {
          errCallback(model);
        }
      });
  }
});

module.exports = User;