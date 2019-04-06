$(function () {
  $('.nav-p-one').click(function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $(this).next().hide();
    } else {
      $('.nav-p-one').removeClass('active');
      $(this).addClass('active');
      $('.nav-ul-tow').hide();
      $(this).next().show();
    }
  })
  $('.nav-li-tow').click(function () {
    $('.nav-li-tow').removeClass('active');
    $(this).addClass('active');
  })
  $('.nav-p-one').each(function (index, element) {
    if ($(this).hasClass('active')) {
      $(this).next().show();
    }
  })
  $('.nav-li-tow').click(function () {
    if (!$(this).hasClass('add-li')) {
      let id = parseInt($(this).attr('id'));
      $.get('/article/getArticle?id=' + id, function (data, err) {
        $('#content').html(data);
      })
    } else {
      let menuId = parseInt($(this).attr('id'));
      $.get('/article/addArticle?menuId=' + menuId, function (data, err) {
        $('#content').html(data);
      })
    }
  });
  $('.content').delegate('.wordBody', 'dblclick', function () {
    var value = $(this).text();
    $(this).html(`<input type='text' class='enterBody' value="${value}" autofocus />`)
  });
  $('.content').delegate('.enterBody', 'keydown', function (event) {
    if (event.keyCode == "13") {
      let wordBody = $(this).val();
      let wordId = $(this).parent().parent().attr('id');
      $(this).parent().text(wordBody);
      $(this).remove();
      let url = '/word/updateWordBody?wordId=' + wordId + '&wordBody="' + wordBody + '"';
      $.get(url, function (data, err) {
        console.log(err);
      })
    }
  });
  $('.content').delegate('.del', 'click', function () {
    var wordId = $(this).parent().parent().attr('id');
    var url = '/word/deleteWordById?wordId=' + wordId;
    var $item = $(`#${wordId}`);
    $.get(url, function (data, err) {
      if (data == "true") {
        alert("删除成功！");
        $item.remove();
      } else {
        alert("删除失败！")
      }
    })
  });
  $('.add-menu span').click(function () {
    $(this).parent().html("<input type='text' class='enterMenu' autofocus />")
  });
  $('.add-menu').delegate('input', 'keydown', function (event) {
    if (event.keyCode == "13") {
      var menuName = $(this).val();
      if (menuName) {
        $.get('/menu/addmenu?menuName=' + menuName, function (data) {
          location.reload()
        })
      }
    }
  });
})