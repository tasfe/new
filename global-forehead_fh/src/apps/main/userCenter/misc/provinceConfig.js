"use strict";

var province = [
  {
    provinceId: 110000,
    province: '北京',
    firstLetter: 'b'
  },
  {
    provinceId: 120000,
    province: '天津',
    firstLetter: 't'
  },
  {
    provinceId: 130000,
    province: '河北',
    firstLetter: 'h'
  },
  {
    provinceId: 140000,
    province: '山西',
    firstLetter: 's'
  },
  {
    provinceId: 150000,
    province: '内蒙古',
    firstLetter: 'n'
  },
  {
    provinceId: 210000,
    province: '辽宁',
    firstLetter: 'l'
  },
  {
    provinceId: 220000,
    province: '吉林',
    firstLetter: 'j'
  },
  {
    provinceId: 230000,
    province: '黑龙江',
    firstLetter: 'h'
  },
  {
    provinceId: 310000,
    province: '上海',
    firstLetter: 's'
  },
  {
    provinceId: 320000,
    province: '江苏',
    firstLetter: 'j'
  },
  {
    provinceId: 330000,
    province: '浙江',
    firstLetter: 'z'
  },
  {
    provinceId: 340000,
    province: '安徽',
    firstLetter: 'a'
  },
  {
    provinceId: 350000,
    province: '福建',
    firstLetter: 'f'
  },
  {
    provinceId: 360000,
    province: '江西',
    firstLetter: 'j'
  },
  {
    provinceId: 370000,
    province: '山东',
    firstLetter: 's'
  },
  {
    provinceId: 410000,
    province: '河南',
    firstLetter: 'h'
  },
  {
    provinceId: 420000,
    province: '湖北',
    firstLetter: 'h'
  },
  {
    provinceId: 430000,
    province: '湖南',
    firstLetter: 'h'
  },
  {
    provinceId: 440000,
    province: '广东',
    firstLetter: 'g'
  },
  {
    provinceId: 450000,
    province: '广西',
    firstLetter: 'g'
  },
  {
    provinceId: 460000,
    province: '海南',
    firstLetter: 'h'
  },
  {
    provinceId: 500000,
    province: '重庆',
    firstLetter: 'c'
  },
  {
    provinceId: 510000,
    province: '四川',
    firstLetter: 's'
  },
  {
    provinceId: 520000,
    province: '贵州',
    firstLetter: 'g'
  },
  {
    provinceId: 530000,
    province: '云南',
    firstLetter: 'y'
  },
  {
    provinceId: 540000,
    province: '西藏',
    firstLetter: 'x'
  },
  {
    provinceId: 610000,
    province: '陕西',
    firstLetter: 's'
  },
  {
    provinceId: 620000,
    province: '甘肃',
    firstLetter: ''
  },
  {
    provinceId: 630000,
    province: '青海',
    firstLetter: 'g'
  },
  {
    provinceId: 640000,
    province: '宁夏',
    firstLetter: 'n'
  },
  {
    provinceId: 650000,
    province: '新疆',
    firstLetter: 'x'
  }
];

module.exports = {
  get: function(id) {
    return _(banks).findWhere({
      id: id
    });
  }
};
