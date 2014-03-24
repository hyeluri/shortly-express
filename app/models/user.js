var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName:'users',
  initialize: function(params){
    this.set('username', params['username']);
    this.set('password', params['password']);
  },
  isValid:function(errCallback, okCallback){
    var salt = bcrypt.genSaltSync(10); // 10 rounds to process the data
    var hash = bcrypt.hashSync(this.password, salt);
    this.query()
      .where({'username': this.get('username'), 'password':hash})
      .then(function(model){
        if(model.length === 1){
          okCallback(model);
        } else {
          errCallback(model);
        }
      });
  }
});

module.exports = User;