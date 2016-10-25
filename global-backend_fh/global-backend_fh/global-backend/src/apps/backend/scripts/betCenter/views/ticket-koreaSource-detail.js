define(function (require, exports, module) {
  var KoreaSourceDetailView = Base.ItemView.extend({

    template: require('text!betCenter/templates/ticket-koreaSource-detail.html'),

    onRender: function () {
      var self = this;
      self.$('.js-bc-openNumSource').html(self.options.openNum);
      //var openNun = self.options.openNum.split(',').join('+');

      var openNun = self.options.openNum.split(',');
      $.each(openNun,function(key,value) {
        if(key == 0 || key == 4 || key == 8 || key == 12 || key == 16 ){
          count = 0;
          result = 0;
        }
        count = count + "+" + value;
        result += parseInt(value);
        if(key == 3){
          first = (""+result).substring(0,(""+result).length-1);
          last = "<font color='red'>"+(""+result).substring((""+result).length-1,(""+result).length)+"</font>";
          self.$('.js-bc-wan').html(count.replace('0+','')+"="+first+last);
        }else if(key == 7){
          first = (""+result).substring(0,(""+result).length-1);
          last = "<font color='red'>"+(""+result).substring((""+result).length-1,(""+result).length)+"</font>";
          self.$('.js-bc-qian').html(count.replace('0+','')+"="+first+last);
        }else if(key == 11){
          first = (""+result).substring(0,(""+result).length-1);
          last = "<font color='red'>"+(""+result).substring((""+result).length-1,(""+result).length)+"</font>";
          self.$('.js-bc-bai').html(count.replace('0+','')+"="+first+last);
        }else if(key == 15){
          first = (""+result).substring(0,(""+result).length-1);
          last = "<font color='red'>"+(""+result).substring((""+result).length-1,(""+result).length)+"</font>";
          self.$('.js-bc-shi').html(count.replace('0+','')+"="+first+last);
        }else if(key == 19){
          first = (""+result).substring(0,(""+result).length-1);
          last = "<font color='red'>"+(""+result).substring((""+result).length-1,(""+result).length)+"</font>";
          self.$('.js-bc-ge').html(count.replace('0+','')+"="+first+last);
        }
      });
    },
  });

  module.exports = KoreaSourceDetailView;

});
