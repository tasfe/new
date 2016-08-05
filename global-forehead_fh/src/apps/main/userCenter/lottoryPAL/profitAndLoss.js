/**
 * Created by herry on 04/08/2016.
 */
var SearchGrid = require('com/searchGrid');

var ProfitAndLoss = SearchGrid.extend({

    template: require('./index.html'),

    events: {
        'click .js-excess-cell': 'dateSelectHandler'
    }



});

module.exports = ProfitAndLoss;