define(function(require, exports, module) {

var headConfig = [
    {
        headId: 1,
        img: 'images/headId_1.png'
    },
    {
        headId: 2,
        img: 'images/headId_2.png'
    },
    {
        headId: 3,
        img: 'images/headId_3.png'
    },
    {
        headId: 4,
        img: 'images/headId_4.png'
    },
    {
        headId: 5,
        img: 'images/headId_5.png'
    },
    {
        headId: 6,
        img: 'images/headId_6.png'
    },
    {
        headId: 7,
        img: 'images/headId_7.png'
    },
    {
        headId: 8,
        img: 'images/headId_8.png'
    },
    {
        headId: 9,
        img: 'images/headId_9.png'
    },
    {
        headId: 10,
        img: 'images/headId_10.png'
    },
    {
        headId: 11,
        img: 'images/headId_11.png'
    },
    {
        headId: 12,
        img: 'images/headId_12.png'
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