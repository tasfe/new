function numRand() {
  var x = 9999; //上限
  var y = 1111; //下限
  var rand = parseInt(Math.random() * (x - y + 1) + y);
  return rand;
}
var isBegin = false;
$(function(){
  var u = 265;
  $('.btn').click(function(){
    if(isBegin) return false;
    isBegin = true;
    $(".num").css('backgroundPositionY',0);
    var result = numRand();
    $('#res').text('摇奖结果 = '+result);
    var num_arr = (result+'').split('');
    $(".num").each(function(index){
      var _num = $(this);
      setTimeout(function(){
        _num.animate({
          backgroundPositionY: (u*60) - (u*num_arr[index])
        },{
          duration: 6000+index*3000,
          easing: "easeInOutCirc",
          complete: function(){
            if(index==3) isBegin = false;
          }
        });
      }, index * 300);
    });
  });
})();