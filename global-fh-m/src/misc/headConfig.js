define(function(require, exports, module) {

var headConfig = [
    {
        headId: 1,
        img: require('images/headId_1.png')
    },
    {
        headId: 2,
        img: require('images/headId_2.png')
    },
    {
        headId: 3,
        img: require('images/headId_3.png')
    },
    {
        headId: 4,
        img: require('images/headId_4.png')
    },
    {
        headId: 5,
        img: require('images/headId_5.png')
    },
    {
        headId: 6,
        img: require('images/headId_6.png')
    },
    {
        headId: 7,
        img: require('images/headId_7.png')
    },
    {
        headId: 8,
        img: require('images/headId_8.png')
    },
    {
        headId: 9,
        img: require('images/headId_9.png')
    },
    {
        headId: 10,
        img: require('images/headId_10.png')
    },
    {
        headId: 11,
        img: require('images/headId_11.png')
    },
    {
        headId: 12,
        img: require('images/headId_12.png')
    }];


    return {
        get: function(hid) {
            var headImg = _.findWhere(headConfig, {
                headId: hid
            });
            return headImg;
        }
    };
});